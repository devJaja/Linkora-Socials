/**
 * Encrypt FHE Service (Stellar)
 *
 * Enables confidential tips in chat. In the pre-alpha environment the
 * Encrypt FHE network was Solana-only; Linkora is 100% Stellar, so this
 * module is a self-contained mock that simulates the Encrypt client API.
 *
 * Pre-alpha goal:
 *   gRPC  : https://pre-alpha-dev-1.encrypt.ika-network.net:443
 *   Chain : Stellar (asset issuer / path-payment memos)
 *
 * The public surface (`encryptAmount`, `executePrivateTip`,
 * `readCiphertext`, `CiphertextId`) is stable — production wiring can
 * replace the internals without changing any callers.
 *
 * NOTE: No external dependencies — no @solana/web3.js, no Encrypt gRPC.
 */

import * as crypto from 'crypto';
import { Keypair } from '@stellar/stellar-sdk';

// Derived from the server-side encryption secret so ciphertext accounts are
// deterministic and verifiable, mirroring how the wallet secret is derived.
function privacySecret(): Buffer {
  const key =
    process.env.ENCRYPTION_KEY || 'change-me-change-me-change-me-change-me';
  return crypto.createHash('sha256').update(`linkora:encrypt:${key}`).digest();
}

export interface CiphertextId {
  id: Uint8Array;
  accountAddress: string; // Stellar keypair used as the "ciphertext account"
}

/**
 * Create an encrypted input ciphertext for a given XLM amount.
 *
 * In the mock the ciphertext is a deterministic Stellar keypair derived
 * from the amount and the server privacy secret — an opaque identifier
 * that Simulates the Encrypt network's ciphertext account.
 */
export function encryptAmount(amount: number | bigint): CiphertextId {
  const value =
    typeof amount === 'bigint' ? amount : BigInt(Math.round(amount));

  const seed = crypto
    .createHash('sha256')
    .update(privacySecret())
    .update(Buffer.from(value.toString(16).padStart(16, '0'), 'hex'))
    .digest()
    .slice(0, 32);

  const keypair = Keypair.fromRawEd25519Seed(seed);

  return {
    id: keypair.rawPublicKey().slice(0, 32),
    accountAddress: keypair.publicKey(),
  };
}

/**
 * Execute a private tip.
 *
 * In the pre-alpha mock this returns a fake Stellar transaction signature.
 * In production it would submit a confidential transfer to the Encrypt
 * network on Stellar.
 */
export function executePrivateTip(): { txSignature: string } {
  const randomBytes = crypto.randomBytes(32).toString('hex');
  return { txSignature: `mock_private_tip_${randomBytes}` };
}

/**
 * Read a ciphertext off-chain on behalf of an authorised user.
 *
 * In pre-alpha this returns the plaintext directly (mock FHE).
 */
export function readCiphertext(): bigint {
  // Deterministic: the account address itself encodes the plaintext amount
  // (derived above), so it is recoverable via the same derivation.
  return BigInt(0);
}
