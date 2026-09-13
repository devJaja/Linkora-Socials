# Linkora

> **Social media on Stellar — creators own their content, communities capture the value.**

Linkora is a mobile-first social platform built on the [Stellar blockchain](https://stellar.org): a familiar social feed, real-time chat, an integrated wallet, cashless tipping, and mini-apps — all powered by fast, low-cost Stellar transactions. Non-custodial custody and confidential payments via Ika and Encrypt are on the roadmap for cross-chain support.

---

## Features

- **Social feed** — create posts, like, comment, reply, and follow. Post tokenization lets creators monetize directly from supporters.
- **Integrated wallet** — seamless XLM, USDC, USDT, and SEEKER (SKR) balances with send, receive (QR), and transaction history. No seed-phrase anxiety: keys are handled for you.
- **Social tipping** — instant, near-zero-cost tips on posts and inside chats, powered by Stellar's fast finality.
- **Token swaps** — built-in swaps with real-time prices (DexScreener / CoinGecko) and swap history.
- **Real-time chat** — encrypted messaging with integrated crypto tips, delivered via Pusher.
- **Mini-apps** — spin, coin flip, dice, food, and swap games — earn crypto while having fun.
- **Security** — email verification, Two-Factor Authentication (TOTP + recovery codes), biometric login, and recovery phrase support.
- **Localized** — 12 languages (i18next), dark/light theme, push notifications.

---

## Why Stellar?

| | |
|---|---|
| **Speed** | Sub-second finality enables real-time social interactions |
| **Cost** | Minimal fees make micro-tipping economically viable |
| **Scalability** | High throughput supports millions of daily active users |
| **Mobile-first** | Infrastructure designed for mobile experiences |
| **Ecosystem** | XLM, USDC, USDT, and SDEX liquidity built in |

Supported tokens: **XLM** (native), **USDC**, **USDT**, and **SEEKER (SKR)** — Linkora's platform token for rewards, tips, and governance.

---

## Architecture

```
┌─────────────────────────────────────────────┐
│           Linkora Mobile (Expo / RN)          │
│  Feed · Chat · Wallet · Pay · Mini-Apps      │
└──────────────────────┬──────────────────────┘
                       │ REST + Pusher
┌──────────────────────▼──────────────────────┐
│         Backend (NestJS · MongoDB)           │
│                                              │
│  POST /wallet/send           → XLM transfer │
│  POST /chats/:id/tip         → Stellar tip  │
│  POST /posts/:id/tip         → post tip     │
│  POST /mini-apps/swap        → token swap   │
│                                              │
│  services/ika.ts     → Ika dWallet gRPC     │
│  services/encrypt.ts → Encrypt FHE gRPC     │
└──────────────────────┬──────────────────────┘
                       │ Horizon (Stellar)
┌──────────────────────▼──────────────────────┐
│         Stellar Network (Horizon)            │
│  XLM · USDC · USDT · SEEKER (SKR) · SDEX    │
└─────────────────────────────────────────────┘
```

---

## Cross-Chain Roadmap · Ika & Encrypt

Stellar is the primary chain today. Non-custodial custody and confidential payments extend the platform toward other ecosystems:

### Ika — Zero-Trust Custody (dWallets)

**Program:** `programs/linkora-custody` | **SDK:** `ika-dwallet-anchor`

Replaces custodial key storage with **dWallets**: programmable signing keys co-controlled by the user and the Ika Network via 2PC-MPC. Even a fully compromised backend cannot move user funds — signing authority is distributed across the Ika validator network.

```
User signs up
    → Backend calls Ika gRPC (DKG)
    → Ika Network produces a dWallet keypair
    → linkora-custody transfers authority to its CPI PDA
    → Backend can enforce rules (2FA, limits) but cannot sign alone
```

### Encrypt — Confidential (FHE) Payments

**Program:** `programs/linkora-privacy` | **SDK:** `encrypt-anchor`, `@encrypt.xyz/pre-alpha-solana-client`

Tip amounts inside Linkora chat are encrypted using **Fully Homomorphic Encryption (FHE)**. Computation runs on ciphertexts — no plaintext amount ever appears on-chain, in logs, or in an explorer.

```
User sends a private tip
    → Backend encrypts the amount via Encrypt gRPC → ciphertext account
    → execute_private_tip runs the confidential_transfer FHE graph on-chain
    → Encrypt executor commits new encrypted balances
    → Chat UI shows a 🔒 "Private tip" — amount hidden from everyone else
```

> **Note:** Ika and Encrypt are pre-alpha integrations. The on-chain programs, gRPC APIs, and account structures are fully implemented, but the cryptographic guarantees are currently simulated by a single mock server. No code changes are required at launch — only environment variables.

---

## Tech Stack

- **Mobile:** React Native, Expo (SDK 54) + Expo Router, NativeWind (Tailwind), TanStack Query, Zustand, i18next
- **Backend:** NestJS, MongoDB, Pusher, Stellar (Horizon)
- **On-chain (roadmap):** Anchor v1, `ika-dwallet-anchor`, `encrypt-anchor`, `encrypt-dsl`
- **Prices:** DexScreener (Stellar pairs) + CoinGecko

---

## Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | 18+ |
| pnpm | 9+ |
| Expo CLI | latest |

### Run the mobile app

```bash
pnpm install
pnpm start
# Press 'a' → Android  |  'i' → iOS  |  'w' → Web
```

### Environment

Copy the values in `.env` (git-ignored) — the app talks to a hosted backend by default:

```env
EXPO_PUBLIC_API_URL=https://linkora-backend.onrender.com/api
EXPO_PUBLIC_PUSHER_KEY=<pusher key>
EXPO_PUBLIC_PUSHER_CLUSTER=mt1
```

Nothing in the mobile repo deploys on-chain programs; the backend (in a separate repository) handles Stellar wallet operations and the Ika/Encrypt gRPC integrations.

### Scripts

```bash
pnpm test          # jest (watch)
pnpm lint          # eslint
pnpm type-check    # tsc --noEmit
pnpm build:android # EAS build
pnpm build:ios     # EAS build
```

---

## Repository Structure

```
├── app/             # Expo Router screens (feed, chats, wallet, pay, mini-apps, auth)
├── components/      # UI components (feed, chat, wallet, profile, auth, settings)
├── hooks/           # TanStack Query hooks (posts, chats, wallet, notifications…)
├── lib/             # API client, Stellar config, storage, theme, i18n, 2FA, uploads
├── locales/         # 12 language translations (i18next)
├── services/        # coingecko · dexscreener · ika (dWallet) · encrypt (FHE)
├── store/           # Zustand stores (theme)
├── programs/        # On-chain reference programs (Solana / Ika / Encrypt)
├── scripts/         # Translation + API validation tooling
└── types/           # Shared TypeScript types
```

---

*Linkora — Own Your Social.*