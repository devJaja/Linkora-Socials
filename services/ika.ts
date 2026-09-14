/**
 * Ika dWallet Service (Stellar) — MOBILE CLIENT MOCK
 *
 * In production the mobile client never touches private key material;
 * wallet creation and signing are delegated to the Linkora backend via the
 * Ika dWallet (2PC-MPC) network.
 *
 * This module is a dependency-free, Stellar-native stub kept for API
 * parity. It performs no network calls and holds no keys.
 */

export interface DWalletInfo {
  dWalletId: string;
  publicKey: string;
  attestation: string;
}

/**
 * Create a dWallet for a new user.
 *
 * Mobile returns a placeholder — the real dWallet is created server-side
 * through the backend's Ika integration.
 */
export function createDWallet(_seedMaterial: string): DWalletInfo {
  return {
    dWalletId: '',
    publicKey: '',
    attestation: '',
  };
}

/**
 * Sign and submit a transfer funded by the user's (encrypted) wallet.
 *
 * Mobile client: no-op placeholder. Actual signing flows through
 * `POST /api/wallet/send` on the backend.
 */
export async function signTransfer(_params: {
  fromAddress: string;
  encryptedSecret: string;
  toAddress: string;
  amount: number;
  memo?: string;
}): Promise<string> {
  throw new Error('Client-side signing is not supported — use the backend wallet API');
}

/**
 * Validate a Stellar address.
 */
export function isDwalletAddress(address: string): boolean {
  return /^G[A-Z2-7]{55}$/.test(address);
}