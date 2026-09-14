# Token Rates (Stellar)

All token rates are relative to **XLM**. The rate represents how many of the
target token you get for 1 XLM (at current USD-equivalent prices).

## Fixed vs. Live Rates

- **USDC / USDT** are pegged at $1.00.
- **XLM / SEEKER** use live prices from DexScreener (Stellar pairs) with a
  CoinGecko fallback, then a static fallback rate.

### Reference prices (fallback)

| Token | USD price (fallback) |
|-------|----------------------|
| XLM   | $0.12                |
| USDC  | $1.00                |
| USDT  | $1.00                |
| SEEKER| $0.05                |

## Example Calculations

#### 1. XLM to USDC
- Swap: 1 XLM → ? USDC
- `rate = 0.12 / 1 = 0.12`
- Result: 1 XLM = 0.12 USDC

#### 2. USDC to XLM
- Swap: 0.12 USDC → ? XLM
- `rate = 1 / 0.12 = 8.33`
- Result: 0.12 USDC = 1 XLM

#### 3. XLM to SEEKER
- Swap: 1 XLM → ? SEEKER
- `rate = 0.12 / 0.05 = 2.4`
- Result: 1 XLM = 2.4 SEEKER

## Verification

- 1 XLM should equal ~0.12 USDC
- 0.12 USDC should equal ~1 XLM
- 1 XLM should equal ~2.4 SEEKER

## Notes

- Rates are USD-equivalent quotes from DexScreener/CoinGecko, not an
  order-book mid. Actual execution uses Stellar path payments on the SDEX.
- USDC issuer: `GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN`
- USDT issuer: `GANGSGREXTQ3RGQJKFGN6TZX3XP3YV5TJMGLC3NKAD3QJKZJQTYFGZF`
- See `swap.service.ts` for the exact implementation.