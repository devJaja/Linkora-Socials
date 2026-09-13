// Stellar Network Configuration
export const stellarConfig = {
  horizon: {
    mainnet: 'https://horizon.stellar.org',
    testnet: 'https://horizon-testnet.stellar.org',
  },
  explorer: {
    mainnet: 'https://stellar.expert/explorer/public',
    testnet: 'https://stellar.expert/explorer/testnet',
  },
  dexscreener: {
    baseUrl: 'https://api.dexscreener.com/latest/dex',
    chain: 'stellar', // DexScreener chain id for default/popular Stellar market pairs
  },
} as const;