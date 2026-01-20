# xStocks Price Screener

A real-time price comparison and arbitrage detection tool for tokenized stocks (xStocks) across multiple centralized and decentralized exchanges.

## Features

- **Multi-Platform Price Tracking:**
  - **CEXes:** Bybit (USDT pairs - TSLAx, NVDAx, AAPLx available)
  - **DEXes:** KyberSwap on Ethereum (USDC pairs with RFQ support), Jupiter on Solana (USDC pairs)
  - **Traditional Markets:** Stock prices via Twelve Data API
  - **Note:** Kraken removed - xStocks tokens not available there

- **Arbitrage Detection:** Automatically identifies price discrepancies and calculates potential profit opportunities

- **Real-Time Dashboard:** Clean, modern UI with auto-refresh capabilities

- **Supported Tokens:**
  - TSLAx (Tesla)
  - NVDAx (Nvidia)
  - SPYx (S&P 500 ETF)
  - AAPLx (Apple)

## Setup

### Prerequisites

- Node.js 18+ and npm
- Twelve Data API key (free tier available at [twelvedata.com](https://twelvedata.com/))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd xStocks_pricescreener
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` and add your Twelve Data API key:
```env
TWELVE_DATA_API_KEY=your_api_key_here
```

### Running Locally

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## How It Works

### Price Fetching

The tool fetches prices from multiple sources:

1. **Bybit:** Uses public spot market API for USDT trading pairs
   - Note: TSLAx, NVDAx, and AAPLx are available (SPYx not listed)
2. **KyberSwap:** Queries the aggregator API for best routes on Ethereum
   - Includes both on-chain pool prices and off-chain RFQ (Request for Quote) from market makers
   - Automatically finds the best route across multiple DEXes
3. **Jupiter:** Uses Solana's top DEX aggregator for best prices
4. **Twelve Data:** Fetches real-time stock market prices

### RFQ Support on KyberSwap

KyberSwap's aggregator includes RFQ (Request for Quote) functionality, which can provide better prices than on-chain pools alone. The tool automatically:
- Requests quotes from both pools and market makers
- Identifies when RFQ quotes are being used (marked with "RFQ" badge)
- Compares prices across all liquidity sources

### Arbitrage Detection

The system compares all prices and identifies opportunities where:
- Price spread exceeds 0.5% (configurable)
- Clear buy/sell execution paths exist
- Calculates potential profit per token

## API Endpoints

- `GET /api/prices` - Fetch all token prices across all platforms
- `GET /api/prices/[symbol]` - Fetch prices for a specific token (e.g., `/api/prices/TSLA`)

## Configuration

### Token Configuration

Edit `config/tokens.ts` to add or modify tokens:

```typescript
export const TOKENS: Record<string, TokenConfig> = {
  TSLA: {
    symbol: 'TSLAx',
    stockSymbol: 'TSLA',
    ethereum: { address: '0x...' },
    solana: { address: '...' },
    cex: {
      bybit: 'TSLAXUSDT',
    },
  },
  // ... more tokens
};
```

### API Rate Limits

- **Twelve Data Free Tier:** 8 requests/minute
  - The tool automatically spaces out requests to respect this limit
  - Consider upgrading for higher limits

- **CEX/DEX APIs:** Generally have generous public endpoint limits
  - KyberSwap: No authentication required for aggregator API
  - Jupiter: No authentication required
  - Bybit: Public endpoints used

## Project Structure

```
├── app/
│   ├── api/
│   │   └── prices/          # API routes
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main dashboard
├── components/
│   ├── ArbitrageTable.tsx   # Arbitrage opportunities table
│   ├── PriceCard.tsx        # Individual price display
│   └── TokenComparison.tsx  # Token comparison component
├── config/
│   └── tokens.ts            # Token and API configuration
├── lib/
│   ├── fetchers/            # Price fetcher modules
│   │   ├── bybit.ts
│   │   ├── jupiter.ts
│   │   ├── kyberswap.ts
│   │   └── stocks.ts
│   └── priceComparison.ts   # Price aggregation and arbitrage logic
└── types/
    └── price.ts             # TypeScript type definitions
```

## Troubleshooting

### "No data" showing for some sources

- Check that the token addresses are correct in `config/tokens.ts`
- Verify that the tokens actually exist on those platforms
- Some tokens may have low liquidity on certain DEXes

### Stock prices not loading

- Ensure your Twelve Data API key is set correctly in `.env`
- Check that you haven't exceeded your API rate limit
- Verify the stock market is currently open (prices may be stale when closed)

### KyberSwap prices not loading

- Verify Ethereum token addresses are correct (lowercase, checksummed)
- Check that there's sufficient liquidity for the token on Ethereum DEXes
- Try different amount sizes in the fetcher (default is 1 token)

### Jupiter prices not loading

- Verify Solana token addresses are correct (base58 format)
- Check that the token exists on Solana DEXes
- Some tokens may use different decimal places (adjust in fetcher)

## Future Enhancements

- [ ] Historical price tracking and charts
- [ ] Alert system for arbitrage opportunities above threshold
- [ ] Gas fee estimation for DEX trades
- [ ] Multi-hop arbitrage path detection
- [ ] WebSocket support for real-time updates
- [ ] Mobile-responsive improvements
- [ ] Export opportunities to CSV
- [ ] Integration with more DEXes (1inch, Raydium, etc.)

## License

MIT

## Disclaimer

This tool is for informational purposes only. It does not constitute financial advice. Always verify prices on the actual platforms before trading. Arbitrage opportunities may not be executable due to:
- Slippage
- Gas fees
- Network congestion
- Liquidity constraints
- Market movement
- Exchange restrictions

Trade at your own risk.
