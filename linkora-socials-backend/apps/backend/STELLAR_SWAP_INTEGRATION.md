# Stellar Swap Integration for Real Token Prices

The token swap feature uses **DexScreener** (Stellar pairs) with a **CoinGecko**
fallback to provide real-time pricing for supported Stellar assets.

## Supported Tokens

| Token | Owning network | Asset |
|-------|----------------|-------|
| XLM   | Stellar        | Native lumen |
| USDC  | Stellar        | Circle-issued (asset contract) |
| USDT  | Stellar        | Tether-issued (asset contract) |
| SEEKER| Linkora        | Linkora community token |

## Architecture

### SwapService (`swap.service.ts`)

Handles all price fetching and swap calculation:

- `getTokenPrice(symbol)` — DexScreener → CoinGecko → fallback static rate
- `calculateSwap(fromToken, toToken, fromAmount)` — quote via USD rates
- `getAllTokenPrices()` — all supported token prices
- Uses a 1-minute in-memory price cache

Pricing order for each token:

```
DexScreener (https://api.dexscreener.com/latest/dex/pairs/stellar)
    -> fallback to CoinGecko (api.coingecko.com/api/v3/simple/price)
        -> fallback to static fallback rates
```

USDC and USDT are pegged to $1.00 and skip network lookups.

## API

### Get All Token Prices

```
GET /api/mini-apps/token-prices
```

Response:

```json
{
  "XLM": 0.12,
  "USDC": 1,
  "USDT": 1,
  "SEEKER": 0.05
}
```

### Perform a Swap

```
POST /api/mini-apps/swap
Content-Type: application/json

{
  "fromToken": "XLM",
  "toToken": "USDC",
  "fromAmount": 100
}
```

Response:

```json
{
  "fromToken": "XLM",
  "toToken": "USDC",
  "fromAmount": 100,
  "toAmount": 12,
  "rate": 0.12,
  "priceImpact": 0.1,
  "signature": "swap_1234567890",
  "status": "completed"
}
```

## Executing the swap on-chain

The backend currently records quoted swaps. To execute a real on-chain swap:

1. Use a **Stellar path payment** (`Operation.pathPaymentStrictReceive` /
   `pathPaymentStrictSend`) through the SDEX using the quote's rate.
2. Ensure the destination asset's trustlines exist before sending.
3. Return the actual Horizon transaction hash as `signature`.

```ts
// In swap.service.ts (future):
// const tx = await stellarService.buildPathPayment({ ... });
```

## Notes

- XLM is the native asset; USDC/USDT require trustlines (issuers configured in
  `swap.service.ts` / `lib/tokens.ts`).
- DexScreener data occasionally lags; CoinGecko and fallbacks prevent outages.
- Rate display on the frontend uses the same token list from
  `lib/tokens.ts`.