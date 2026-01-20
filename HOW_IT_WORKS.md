# 🔍 How the xStocks Price Screener Works

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     YOUR BROWSER                                │
│                  (http://localhost:3000)                        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  Dashboard UI (React)                                    │  │
│  │  - Token comparison cards                                │  │
│  │  - Arbitrage opportunities table                         │  │
│  │  - Auto-refresh controls                                 │  │
│  └──────────────────────┬──────────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────────────┘
                          │ HTTP Request
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   NEXT.JS SERVER (API Routes)                   │
│                                                                 │
│  /api/prices                                                    │
│  └─ Fetches all tokens in parallel (with rate limiting)        │
│                                                                 │
│  /api/prices/[symbol]                                           │
│  └─ Fetches single token (e.g., /api/prices/TSLA)             │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│              PRICE COMPARISON ENGINE                            │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐    │
│  │ Fetches all │→ │ Normalizes  │→ │ Finds arbitrage     │    │
│  │ prices in   │  │ price data  │  │ opportunities       │    │
│  │ parallel    │  │             │  │ (spread analysis)   │    │
│  └─────────────┘  └─────────────┘  └─────────────────────┘    │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────────────┐
        │         PARALLEL PRICE FETCHERS             │
        └─────────────────────────────────────────────┘
                          │
         ┌────────────────┼────────────────┐
         │                │                │
         ▼                ▼                ▼
    ┌────────┐      ┌─────────┐      ┌─────────┐
    │  CEX   │      │   DEX   │      │  STOCK  │
    │ Prices │      │ Prices  │      │ MARKET  │
    └────────┘      └─────────┘      └─────────┘
         │                │                │
    │                │                │
    ▼                ▼                ▼
┌───────────┬──────────────┬──────────────┐
│  Bybit    │  KyberSwap   │ Twelve Data  │
│           │              │              │
│  USDT     │  Ethereum    │ Traditional  │
│  pairs    │  DEX + RFQ   │ Stock Prices │
└───────────┴──────────────┴──────────────┘
                           │
                           ▼
                    ┌──────────┐
                    │ Jupiter  │
                    │          │
                    │  Solana  │
                    │   DEX    │
                    └──────────┘
```

## Data Flow

### 1. User Clicks "Refresh Prices"

```
Browser → API Request → /api/prices
```

### 2. Server Fetches All Prices (4 tokens × 4 sources = 16 API calls)

For each token (TSLAx, NVDAx, SPYx, AAPLx):

```javascript
// Parallel fetching
Promise.all([
  fetchStockPrice('TSLA'),      // Twelve Data API
  fetchBybitPrice('TSLAXUSDT'), // Bybit public API (Note: only TSLAx and NVDAx available)
  fetchKyberSwapPrice('0x8ad...', 'TSLAx'),  // KyberSwap + RFQ
  fetchJupiterPrice('XsDoV...', 'TSLAx')     // Jupiter aggregator
])
// Note: Kraken removed - xStocks tokens not available on Kraken
```

**Rate Limiting:**
- Stock API: 8 sec delay between tokens (free tier: 8 req/min)
- CEX/DEX: No delay (public endpoints)

### 3. Price Normalization

```javascript
{
  symbol: 'TSLAx',
  price: 123.45,           // Normalized to USD
  timestamp: 1234567890,   // Unix timestamp
  source: 'Bybit',         // Source name
  sourceType: 'CEX',       // CEX, DEX, or STOCK
  volume24h: 1000000,      // Optional
  isRFQ: false             // For KyberSwap
}
```

### 4. Arbitrage Detection

```javascript
// Compare all price pairs
For each pair of prices:
  Calculate spread = abs(price1 - price2) / price1 × 100
  If spread > 0.5%:
    Create arbitrage opportunity {
      buyFrom: 'Source A',
      sellTo: 'Source B',
      spreadPercent: 2.5,
      potentialProfit: $5.00
    }
```

### 5. Return to Browser

```json
{
  "success": true,
  "data": [
    {
      "symbol": "TSLAx",
      "stockPrice": { ... },
      "prices": {
        "bybit": { ... },
        "kraken": null,
        "kyberswap": { ... },
        "jupiter": { ... }
      },
      "arbitrageOpportunities": [
        {
          "buyFrom": "Bybit",
          "sellTo": "Stock Market",
          "spreadPercent": 2.5,
          "potentialProfit": 5.00
        }
      ]
    }
  ]
}
```

## Price Fetching Details

### Bybit (CEX)
- **Endpoint:** `GET /v5/market/tickers`
- **Pairs:** TSLAXUSDT, NVDAXUSDT (only these two available)
- **Update:** Real-time
- **Limit:** Public endpoint, no auth needed
- **Note:** SPYx and AAPLx not listed on Bybit

### KyberSwap (DEX - Ethereum)
- **Endpoint:** `GET /ethereum/api/v1/routes`
- **Method:** Request quote for token → USDC swap
- **Features:**
  - Queries multiple DEXes (Uniswap, Sushiswap, etc.)
  - Includes RFQ from market makers
  - Returns best execution route
- **Update:** Real-time on-chain + off-chain RFQ

### Jupiter (DEX - Solana)
- **Endpoint:** `GET /quote`
- **Method:** Request quote for token → USDC swap
- **Features:**
  - Aggregates all Solana DEXes
  - Smart route splitting
  - Real-time pricing
- **Update:** Real-time on-chain

### Twelve Data (Stock Market)
- **Endpoint:** `GET /price` or `/quote`
- **Symbols:** TSLA, NVDA, SPY, AAPL
- **Update:** Real-time during market hours
- **Limit:** Free tier = 8 requests/min
- **Market Hours:** 9:30 AM - 4:00 PM ET, Mon-Fri

## Arbitrage Calculation Example

```
Stock Market (TSLA): $100.00
Bybit (TSLAx):       $102.50
KyberSwap (TSLAx):   $99.50
Jupiter (TSLAx):     $100.25

Opportunities:
1. Buy KyberSwap ($99.50) → Sell Bybit ($102.50)
   Spread: 3.0% | Profit: $3.00 per token

2. Buy KyberSwap ($99.50) → Sell Stock Market ($100.00)
   Spread: 0.5% | Profit: $0.50 per token

3. Buy Jupiter ($100.25) → Sell Bybit ($102.50)
   Spread: 2.24% | Profit: $2.25 per token
```

## UI Features

### Price Cards
- **Green background**: Price lower than stock
- **Red background**: Price higher than stock
- **Deviation %**: Shows how far from stock price
- **RFQ Badge**: Purple badge when KyberSwap uses RFQ

### Arbitrage Table
- **Sorted by spread %**: Highest opportunities first
- **Color-coded spreads**:
  - Red: High spread (>2%)
  - Yellow: Medium spread (1-2%)
  - Green: Low spread (0.5-1%)

### Auto-Refresh
- **Interval**: 60 seconds
- **Smart**: Only refreshes when tab is active
- **Status**: Shows last update time

## Performance

**Initial Load:**
- First token: ~8 seconds
- All 4 tokens: ~32-40 seconds (rate limiting)

**Subsequent Refreshes:**
- Same timing (API rate limits)

**Optimization:**
- Parallel fetching within each token
- Sequential fetching between tokens (rate limits)
- Caching on browser side (1 minute)

## Error Handling

Each price fetcher:
1. Tries primary endpoint
2. Falls back to alternative if available
3. Returns `null` if all fail
4. Logs error for debugging

The UI:
- Shows available prices even if some sources fail
- Displays error messages for missing API keys
- Handles rate limiting gracefully

---

**Summary:** The system fetches prices from 4 sources (Stock Market, Bybit, KyberSwap, Jupiter) for 4 tokens (TSLAx, NVDAx, SPYx, AAPLx), compares them, identifies arbitrage opportunities, and displays everything in an easy-to-read dashboard with real-time updates. Note that Bybit only lists TSLAx and NVDAx.
