# Testing and Debugging Guide

## 🔍 Current Issues Analysis

Based on your error logs, here's what's happening:

### ✅ What's Working:
- **API endpoint reached**: All APIs are responding (no network errors)
- **Code structure**: No crashes or syntax errors
- **Token addresses**: Valid Ethereum and Solana addresses

### ❌ What's Failing:

#### 1. **Bybit: "Not supported symbols"**
```
Bybit API error for TSLAXUSDT: Not supported symbols
```

**Problem**: The symbol `TSLAXUSDT` doesn't exist in Bybit's system
**Possible reasons**:
- API format different from display name
- Token not actually listed on Bybit
- Different symbol naming

#### 2. **Kraken: "No data found"**
```
Kraken: No data found for TSLAXUSD (tried variants: TSLAXUSD, TSLAX/USD, XTSLAXUSD)
```

**Problem**: None of the symbol variants work
**The code tries**: `TSLAXUSD`, `TSLAX/USD`, `XTSLAXUSD`

#### 3. **Jupiter: 401 Unauthorized**
```
Error fetching Jupiter quote for TSLAx: { code: 401, message: 'Unauthorized' }
```

**Problem**: Quote API now requires authentication (I already fixed this)

#### 4. **KyberSwap: 404**
```
Error fetching KyberSwap price for TSLAx: { status: 404, message: '' }
```

**Problem**: Either no route found or token not supported

---

## 🛠️ How to Verify the CORRECT API Symbols

### **Step 1: Verify on Bybit**

1. **Method A - Check API directly:**
   ```bash
   # Test with a known working symbol first
   curl "https://api.bybit.com/v5/market/tickers?category=spot&symbol=BTCUSDT"

   # Then test with your token (try different formats)
   curl "https://api.bybit.com/v5/market/tickers?category=spot&symbol=TSLAXUSDT"
   curl "https://api.bybit.com/v5/market/tickers?category=spot&symbol=TSLA-USDT"
   ```

2. **Method B - Use Bybit website:**
   - Go to: https://www.bybit.com/trade/spot/TSLAX/USDT
   - Open browser DevTools (F12)
   - Go to Network tab
   - Refresh page
   - Look for API calls to see what symbol format they use

3. **Method C - Check Bybit API docs:**
   - Go to: https://bybit-exchange.github.io/docs/v5/market/tickers
   - Look for example symbols

### **Step 2: Verify on Kraken**

1. **Method A - Check API directly:**
   ```bash
   # Test with known symbol
   curl "https://api.kraken.com/0/public/Ticker?pair=BTCUSD"

   # Test with your token
   curl "https://api.kraken.com/0/public/Ticker?pair=TSLAXUSD"
   ```

2. **Method B - Use Kraken website:**
   - Go to: https://pro.kraken.com/app/trade/tslax-usd
   - Open DevTools → Network tab
   - See what API calls are made

### **Step 3: Verify on KyberSwap**

**Test the API directly:**
```bash
# Replace with your token address
curl "https://aggregator-api.kyberswap.com/ethereum/api/v1/routes?tokenIn=0x8ad3c73f833d3f9a523ab01476625f269aeb7cf0&tokenOut=0xdac17f958d2ee523a2206206994597c13d831ec7&amountIn=1000000000000000000&saveGas=false"
```

If this returns 404, the token might not have liquidity or routes available.

---

## 🎯 What I Need From You

### **Question 1: Can you actually trade these tokens on Bybit?**

- Open https://www.bybit.com/
- Search for "TSLAx"
- Does it appear in search results?
- Can you see the trading page?
- **Screenshot or URL** of the trading page would help!

### **Question 2: Can you actually trade these tokens on Kraken?**

- Open https://pro.kraken.com/
- Search for "TSLAx"
- Does it appear?
- **Screenshot or URL** of the trading page would help!

### **Question 3: Are these tokens REALLY on these exchanges?**

Maybe these xStocks tokens are:
- Only on DEXes (KyberSwap, Jupiter)?
- Not on CEXes at all?
- Under different names on CEXes?

---

## 💡 Alternative Approach: Focus on DEXes Only

If these tokens don't exist on Bybit/Kraken, we can:

1. **Remove CEX fetchers** and focus only on:
   - KyberSwap (Ethereum)
   - Jupiter (Solana)
   - Stock Market (Twelve Data)

2. **Compare**: Stock price vs DEX prices

Would this work for you?

---

## 🧪 Testing Commands You Can Run

### **Test 1: Check if Bybit API works at all**
```bash
npm run dev
# Then in browser console at localhost:3000:
fetch('https://api.bybit.com/v5/market/tickers?category=spot&symbol=BTCUSDT')
  .then(r => r.json())
  .then(console.log)
```

### **Test 2: Check your xStocks token on Bybit**
```bash
fetch('https://api.bybit.com/v5/market/tickers?category=spot&symbol=TSLAXUSDT')
  .then(r => r.json())
  .then(console.log)
```

### **Test 3: Check KyberSwap route**
```bash
fetch('https://aggregator-api.kyberswap.com/ethereum/api/v1/routes?tokenIn=0x8ad3c73f833d3f9a523ab01476625f269aeb7cf0&tokenOut=0xdac17f958d2ee523a2206206994597c13d831ec7&amountIn=1000000000000000000')
  .then(r => r.json())
  .then(console.log)
```

---

## 🚀 Next Steps

**Please verify:**

1. ✅ Do these tokens ACTUALLY exist on Bybit? (not just planned or delisted)
2. ✅ Do these tokens ACTUALLY exist on Kraken? (not just planned or delisted)
3. ✅ What is the EXACT API symbol format? (run the test commands above)

**Then I can:**
- Update the correct symbols
- Or remove CEX support if tokens aren't listed there
- Focus on DEX + Stock comparison only

---

Let me know what you find! 🔍
