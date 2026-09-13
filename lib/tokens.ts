export interface TokenConfig {
  symbol: string;
  name: string;
  icon: string;
  color: string;
  coingeckoId?: string;
  address?: string;
  issuer?: string;
}

export const TOKENS: TokenConfig[] = [
  {
    symbol: 'XLM',
    name: 'Stellar Lumens',
    icon: '✱',
    color: 'bg-purple-600',
    coingeckoId: 'stellar',
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    icon: '₮',
    color: 'bg-green-600',
    coingeckoId: 'tether',
    issuer: 'GANGSGREXTQ3RGQJKFGN6TZX3XP3YV5TJMGLC3NKAD3QJKZJQTYFGZF',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    icon: '$',
    color: 'bg-blue-500',
    coingeckoId: 'usd-coin',
    issuer: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
  },
  {
    symbol: 'SEEKER',
    name: 'Seeker',
    icon: 'SK',
    color: 'bg-blue-600',
  },
];

export const getTokenBySymbol = (symbol: string): TokenConfig | undefined => {
  return TOKENS.find((token) => token.symbol === symbol);
};

export const getTokenIcon = (symbol: string): string => {
  return getTokenBySymbol(symbol)?.icon || '?';
};

export const getTokenColor = (symbol: string): string => {
  return getTokenBySymbol(symbol)?.color || 'bg-gray-600';
};