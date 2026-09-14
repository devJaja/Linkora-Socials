import { Injectable, Logger } from '@nestjs/common';
import {
  Keypair,
  Horizon,
  TransactionBuilder,
  Operation,
  Asset,
  Memo,
  Networks,
  StrKey,
} from '@stellar/stellar-sdk';
import * as crypto from 'crypto';

export interface StellarAssetBalance {
  code: string;
  issuer: string | null;
  balance: number;
}

@Injectable()
export class StellarService {
  private readonly logger = new Logger(StellarService.name);
  private readonly server: Horizon.Server;
  private readonly network: 'public' | 'testnet';
  private readonly networkPassphrase: string;
  private readonly ENCRYPTION_KEY: Buffer;

  constructor() {
    this.network =
      process.env.STELLAR_NETWORK === 'public' ||
      process.env.STELLAR_NETWORK === 'mainnet'
        ? 'public'
        : 'testnet';
    const horizonUrl =
      process.env.STELLAR_HORIZON_URL ||
      (this.network === 'public'
        ? 'https://horizon.stellar.org'
        : 'https://horizon-testnet.stellar.org');
    this.networkPassphrase =
      this.network === 'public' ? Networks.PUBLIC : Networks.TESTNET;
    this.server = new Horizon.Server(horizonUrl);

    const encryptionKey =
      process.env.ENCRYPTION_KEY ||
      '0000000000000000000000000000000000000000000000000000000000000000';
    this.ENCRYPTION_KEY = Buffer.from(encryptionKey, 'hex');

    this.logger.log(`Connected to Stellar ${this.network} via ${horizonUrl}`);
  }

  getServer(): Horizon.Server {
    return this.server;
  }

  getNetwork(): 'public' | 'testnet' {
    return this.network;
  }

  getNetworkPassphrase(): string {
    return this.networkPassphrase;
  }

  isPublicAddress(value: string): boolean {
    return (
      StrKey.isValidEd25519PublicKey(value) ||
      StrKey.isValidMed25519PublicKey(value)
    );
  }

  /**
   * Returns the backend hot keypair used as the fee payer for internal
   * transfers (daily airdrops, mini-app payouts, etc.). Reads from
   * BACKEND_SECRET env var or falls back to a deterministic keypair derived
   * from ENCRYPTION_KEY.
   */
  getBackendKeypair(): Keypair {
    const secret = process.env.BACKEND_SECRET;
    if (secret && StrKey.isValidEd25519SecretSeed(secret)) {
      return Keypair.fromSecret(secret);
    }
    return Keypair.fromRawEd25519Seed(this.ENCRYPTION_KEY.slice(0, 32));
  }

  /**
   * Generate a new Stellar keypair; private key is encrypted before storage.
   */
  generateWallet(): { publicKey: string; encryptedPrivateKey: string } {
    const keypair = Keypair.random();
    const publicKey = keypair.publicKey();
    const encryptedPrivateKey = this.encrypt(keypair.secret());

    this.logger.log(`Generated new Stellar wallet: ${publicKey}`);
    return { publicKey, encryptedPrivateKey };
  }

  /**
   * Get native (XLM) balance plus any issuer-issued asset balances.
   */
  async getBalance(address: string) {
    try {
      const account = await this.server.loadAccount(address);

      let native = 0;
      const assets: StellarAssetBalance[] = [];
      for (const b of account.balances) {
        if (b.asset_type === 'native') {
          native = parseFloat(b.balance);
        } else if (
          b.asset_type === 'credit_alphanum4' ||
          b.asset_type === 'credit_alphanum12'
        ) {
          assets.push({
            code: b.asset_code,
            issuer: b.asset_issuer || null,
            balance: parseFloat(b.balance),
          });
        }
      }

      return {
        walletAddress: address,
        balance: native,
        balanceStroops: Math.round(native * 1e7),
        assets,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get balance for ${address}: ${error.message}`,
      );
      throw new Error(`Failed to get balance: ${error.message}`);
    }
  }

  /**
   * Send XLM (strict payment) from a stored, encrypted keypair.
   */
  async sendTransaction(
    fromAddress: string,
    fromEncryptedSecret: string,
    toAddress: string,
    amount: number,
    memo?: string,
  ): Promise<string> {
    try {
      if (!this.isPublicAddress(toAddress)) {
        throw new Error('Invalid recipient address');
      }

      const secret = this.decrypt(fromEncryptedSecret);
      const sourceKeypair = Keypair.fromSecret(secret);
      if (sourceKeypair.publicKey() !== fromAddress) {
        throw new Error('Wallet key mismatch with stored address');
      }

      const sourceAccount = await this.server.loadAccount(fromAddress);

      // Check balance before attempting payment
      const balance = await this.getBalance(fromAddress);
      if (balance.balance < amount) {
        throw new Error('Insufficient balance');
      }

      const txBuilder = new TransactionBuilder(sourceAccount, {
        fee: (await this.server.fetchBaseFee()).toString(),
        networkPassphrase: this.networkPassphrase,
      }).addOperation(
        Operation.payment({
          destination: toAddress,
          asset: Asset.native(),
          amount: amount.toFixed(7),
        }),
      );

      const trimmedMemo = memo ? memo.slice(0, 28) : undefined;
      if (trimmedMemo) {
        txBuilder.addMemo(Memo.text(trimmedMemo));
      }

      const transaction = txBuilder.setTimeout(60).build();
      transaction.sign(sourceKeypair);

      const result = await this.server.submitTransaction(transaction);
      this.logger.log(`Transaction submitted: ${result.hash}`);
      return result.hash;
    } catch (error) {
      this.logger.error(`Transaction failed: ${error.message}`);
      throw new Error(`Transaction failed: ${error.message}`);
    }
  }

  /**
   * Get payment history for an account from Horizon.
   */
  async getTransactions(address: string, limit = 20) {
    try {
      const records = await this.server
        .payments()
        .forAccount(address)
        .limit(limit)
        .order('desc')
        .call();

      return records.records.map((payment: any) => ({
        signature: payment.transaction_hash,
        type: payment.to === address ? 'receive' : 'send',
        amount: parseFloat(payment.amount || '0'),
        fromAddress: payment.from || payment.source_account,
        toAddress: payment.to,
        status: payment.transaction_successful ? 'confirmed' : 'failed',
        blockTime: payment.created_at
          ? new Date(payment.created_at).toISOString()
          : null,
        fee: 0.0001, // base fee per operation; charged in XLM
      }));
    } catch (error) {
      this.logger.error(
        `Failed to get transaction history for ${address}: ${error.message}`,
      );
      throw new Error(`Failed to get history: ${error.message}`);
    }
  }

  /**
   * Get a single transaction and its payments.
   */
  async getTransactionDetails(signature: string) {
    try {
      const tx = await this.server.transactions().transaction(signature).call();
      const paymentResult = await this.server
        .payments()
        .forTransaction(signature)
        .call();

      return {
        signature: tx.hash,
        successful: tx.successful,
        sourceAccount: tx.source_account,
        ledger: tx.ledger,
        createdAt: tx.created_at,
        fee: parseFloat(String(tx.fee_charged ?? 0)) / 1e7,
        memo: tx.memo,
        payments: paymentResult.records.map((payment: any) => ({
          type: payment.type,
          from: payment.from || payment.source_account,
          to: payment.to,
          amount: parseFloat(payment.amount || '0'),
          assetType: payment.asset_type,
          assetCode: payment.asset_code || null,
          assetIssuer: payment.asset_issuer || null,
        })),
      };
    } catch (error) {
      this.logger.error(`Failed to get transaction: ${error.message}`);
      throw new Error(`Failed to get transaction: ${error.message}`);
    }
  }

  /**
   * Verify a transaction exists on-chain.
   */
  async verifyTransaction(signature: string): Promise<boolean> {
    try {
      await this.server.transactions().transaction(signature);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Request a testnet airdrop via the Stellar Friendbot (testnet only).
   */
  async requestAirdrop(address: string): Promise<string> {
    if (this.network === 'public') {
      throw new Error('Airdrops are not available on the public network');
    }

    const friendbotUrl =
      process.env.STELLAR_FRIENDBOT_URL || 'https://friendbot.stellar.org';
    const response = await fetch(
      `${friendbotUrl}?addr=${encodeURIComponent(address)}`,
    );
    const data = await response.json();

    if (data.hash) {
      this.logger.log(`Airdrop successful: ${data.hash}`);
      return data.hash;
    }

    throw new Error(data.detail || data.title || 'Airdrop failed');
  }

  /**
   * Encrypt a Stellar secret key using AES-256-CBC.
   */
  private encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      this.ENCRYPTION_KEY,
      iv,
    );

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return iv.toString('hex') + ':' + encrypted;
  }

  /**
   * Decrypt a Stellar secret key.
   */
  private decrypt(text: string): string {
    const parts = text.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];

    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      this.ENCRYPTION_KEY,
      iv,
    );

    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
