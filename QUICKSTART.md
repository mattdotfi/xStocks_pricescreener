# 🚀 Quick Start Guide - xStocks Price Screener

## Prerequisites ✅
- Node.js 18+ (You have v22.21.1 ✓)
- npm (You have v10.9.4 ✓)

## Setup Steps

### 1. Get Your Twelve Data API Key (Required for stock prices)

1. Visit: https://twelvedata.com/
2. Click "Sign Up" (top-right)
3. Create a free account with your email
4. Verify your email (check inbox)
5. Login and copy your API key from the dashboard

### 2. Add API Key to .env File

Open the `.env` file and replace `your_api_key_here` with your actual API key:

```bash
# Edit with nano
nano .env

# Or with vim
vim .env
```

Your `.env` should look like:
```
TWELVE_DATA_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

Save and close the file.

### 3. Start the Application

**Easy way (using the start script):**
```bash
./START.sh
```

**Manual way:**
```bash
npm run dev
```

### 4. Open in Browser

Once the server starts, open: **http://localhost:3000**

You should see:
```
  ▲ Next.js 15.5.9
  - Local:        http://localhost:3000

 ✓ Ready in 2s
```

## Using the Dashboard

### First Time:
1. Click the **"Refresh Prices"** button
2. Wait ~30-40 seconds (API rate limits)
3. View the results:
   - **Top Arbitrage Opportunities** table
   - Individual token price comparisons
   - Price deviations and spreads

### Features:
- **Auto-refresh**: Enable to update every 60 seconds
- **Color Coding**:
  - 🟢 Green = Lower than stock price
  - 🔴 Red = Higher than stock price
  - 🟣 Purple "RFQ" badge = KyberSwap using Request for Quote
- **Arbitrage Table**: Shows best opportunities sorted by spread %

## Troubleshooting

### "Error: API key not found"
- Make sure you added your API key to `.env`
- Restart the server after editing `.env`

### "Rate limit exceeded"
- Twelve Data free tier: 8 requests/min
- Wait 60 seconds and try again

### Prices not updating
- Stock market only updates during trading hours (9:30 AM - 4:00 PM ET, Mon-Fri)
- Crypto prices are 24/7

### Server won't start
```bash
# Kill any existing process on port 3000
lsof -ti:3000 | xargs kill -9

# Try again
npm run dev
```

## Data Sources

| Platform | Type | Pairs | Notes |
|----------|------|-------|-------|
| Bybit | CEX | USDT | Spot trading |
| Kraken Pro | CEX | USD | Convert feature |
| KyberSwap | DEX | ETH | Ethereum + RFQ |
| Jupiter | DEX | SOL | Solana aggregator |
| Twelve Data | Stock | USD | Real-time stocks |

## Supported Tokens

- **TSLAx** - Tesla tokenized stock
- **NVDAx** - Nvidia tokenized stock
- **SPYx** - S&P 500 ETF tokenized
- **AAPLx** - Apple tokenized stock

## Commands Reference

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Install dependencies (if needed)
npm install

# Update dependencies
npm update
```

## Need Help?

- Check the console for error messages
- Ensure your API key is valid
- Verify internet connection for API calls
- Check that port 3000 is available

---

**Ready to start?** Run `./START.sh` and open http://localhost:3000 🎉
