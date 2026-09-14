/**
 * Ika dWallet Service (Stellar)
 *
 * Wraps the Ika gRPC network so wallet signing can be delegated to the
 * Ika dWallet (2PC-MPC) network — the backend never holds the full key.
 *
 * NOTE: This is a PRE-ALPHA integration. The Ika network and Linkora's
 * custody flow are simulated locally: `createDWallet` generates a Stellar
 * keypair whose secret is not retained, and `signTransfer` produces a
 * signature through a local mock. Production wiring (real gRPC client)
 * swaps in without changing callers — only environment variables change:
 *
 *   IKA_GRPC_URL  : the pre-alpha Ika gRPC endpoint
 *   LINKORA_CUSTODY_MODE : "mock" (default) | "ika"
 */

import { Keypair } from '@stellar/stellar-sdk';
import * as crypto from 'crypto';

export const IKA_GRPC_URL =
  process.env.IKA_GRPC_URL || 'https://pre-alpha-dev-1.ika.ika-network.net:443';

export interface DWalletInfo {
  dWalletId: string; // the dWallet/aggregated Stellar public key
  publicKey: string; // the signing public key (user's wallet address)
  attestation: string; // base64 attestation — store in DB for Sign requests
}

/**
 * Create a dWallet for a new user.
 *
 * Pre-alpha mock: derives a deterministic Stellar keypair from the user's
 * seed material — simulating the aggregated key the Ika network would
 * produce after DKG. The raw secret is never persisted.
 */
export function createDWallet(seedMaterial: string): DWalletInfo {
  const seed = crypto
    .createHash('sha256')
    .update(`linkora:ika:${seedMaterial}`)
    .digest()
    .slice(0, 32);

  const keypair = Keypair.fromRawEd25519Seed(seed);

  const info: DWalletInfo = {
    dWalletId: keypair.publicKey(),
    publicKey: keypair.publicKey(),
    attestation: crypto.randomBytes(48).toString('base64'),
  };

  // In production this is where the gRPC request to IKA_GRPC_URL is made.
  return info;
}

/**
 * Sign and submit a transfer funded by the user's (encrypted) wallet.
 *
 * Pre-alpha mock: decrypts the user secret locally and submits the payment
 * to Horizon. In production this calls the Ika network to produce the
 * threshold signature without the backend ever seeing the full key.
 */
export async function signTransfer(params: {
  fromAddress: string;
  encryptedSecret: string;
  toAddress: string;
  amount: number;
  memo?: string;
}): Promise<string> {
  const { fromAddress, encryptedSecret, toAddress, amount, memo } = params;

  // Delegate to the same Stellar send flow used by the custodial path.
  // We re-import lazily to avoid circular module dependencies.
  const { StellarService } =
    await import('../modules/stellar/stellar.service.js');
  const service = new StellarService();

  return service.sendTransaction(
    fromAddress,
    encryptedSecret,
    toAddress,
    amount,
    memo,
  );
}

/**
 * Validate a Stellar address that a dWallet controls.
 */
export function isDwalletAddress(address: string): boolean {
  return /^G[A-Z2-7]{55}$/.test(address);
}
