# DEX Integration - How xStocks Tokens Work

## 🔍 Important Context About xStocks Tokens

### What are Rebasing Tokens?
**ALL xStocks tokens (TSLAx, NVDAx, SPYx, AAPLx) are rebasing tokens** on both Ethereum and Solana. This means their balance automatically adjusts to reflect the price of the underlying stock.

### How Rebasing is Handled:

#### **Ethereum**: Wrapped Token System
- Rebasing tokens need to be **wrapped** before trading in pools
- Unwrapped after the trade completes
- KyberSwap aggregator handles this automatically

#### **Solana**: ScaledUI Technology
- Uses **ScaledUI** tech built into the **token2024 standard**
- Handles rebasing **natively** - NO wrapping needed!
- Trades happen directly with the token
- Much simpler and more efficient

---

## 🔷 KyberSwap (Ethereum) Integration

### How It Works:

#### **Wrapped Token Routing (For Pool Trading)**
When using liquidity pools (e.g., Uniswap V3):
1. **Token is wrapped** before trading
2. **Trade happens** with wrapped version in the pool
3. **Token is unwrapped** at the end of the route
4. **Final price** reflects the unwrapped token value

**Example Route:**
```
User Token → Wrap Contract → Uniswap V3 Pool → Unwrap Contract → USDT
```

KyberSwap's aggregator automatically handles this entire route!

#### **RFQ (Request for Quote) Support**
xStocks tokens may be available via **RFQ**, **pools**, or **both**:

- **RFQ Only**: Token only available through market makers (UniX)
- **Pools Only**: Token only available in AMM pools (Uniswap V3 with wrapping)
- **Both RFQ + Pools**: KyberSwap picks the best price

**RFQ Advantages:**
- Direct quotes from market makers
- Often better pricing than pools
- No wrapping needed (direct token trading)
- Our code detects RFQ routes and shows a purple badge

**Which tokens use which?**
- Varies by token and liquidity availability
- KyberSwap automatically checks both and returns the best price

### What Our Code Does:
```typescript
// Requests a route from xStocks token → USDT
tokenIn: tokenAddress,        // xStocks contract (e.g., SPYx)
tokenOut: USDT,              // Target USDT
amountIn: 1 token            // Quote for 1 token

// KyberSwap automatically:
// 1. Finds best route (pool or RFQ)
// 2. Handles wrapping/unwrapping if needed
// 3. Returns final price in USD
```

The API handles all complexity - we just get the final price! ✅

---

## 🔶 Jupiter (Solana) Integration

### How It Works:

**Key Difference: NO Wrapping Needed!** 🎉

On Solana, xStocks tokens use the **token2024 standard** with **ScaledUI technology**, which handles rebasing natively. This means:
- ✅ Direct trading without wrapping
- ✅ Simpler and faster swaps
- ✅ Lower transaction costs

Jupiter aggregates multiple liquidity sources and picks the best:

#### **Raydium (Pools)**
- Traditional AMM pools
- On-chain liquidity
- **Direct token trading** (no wrapping!)
- Standard swap routing

#### **JupZ (RFQ)**
- Request for Quote system
- Off-chain market makers
- Often better for larger trades
- **Direct token trading** (no wrapping!)

**Which tokens use which?**
- Varies by token and liquidity availability
- Jupiter automatically checks both and returns the best price

### What Our Code Does:
```typescript
// Requests a quote from xStocks token → USDC
inputMint: tokenAddress,      // xStocks contract (e.g., NVDAx)
outputMint: USDC,            // Target USDC
amount: 1 token              // Quote for 1 token

// Jupiter automatically:
// 1. Checks Raydium pools (direct, no wrapping!)
// 2. Checks JupZ RFQ quotes (direct, no wrapping!)
// 3. Returns best available price
```

Jupiter picks the best route automatically - we just get the price! ✅

---

## 📊 Token Addresses (Correct Versions)

### Ethereum (for KyberSwap)
```
TSLAx:  0x8ad3c73f833d3f9a523ab01476625f269aeb7cf0
NVDAx:  0x93e62845c1dd5822ebc807ab71a5fb750decd15a
SPYx:   0xc88fcd8b874fdb3256e8b55b3decb8c24eab4c02
AAPLx:  0x9d275685dc284c8eb1c79f6aba7a63dc75ec890a
```

### Solana (for Jupiter)
```
TSLAx:  XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB
NVDAx:  Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh
SPYx:   XsoCS1TfEyfFhfvj8EtZ528L3CaKBDBRqRapnBbDF2W
AAPLx:  XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp
```

---

## 🎯 Why This Matters

### For KyberSwap (Ethereum):
- **ALL xStocks tokens are rebasing** (TSLAx, NVDAx, SPYx, AAPLx)
- **Pool trading** requires wrapping/unwrapping
- **RFQ trading** can happen directly (no wrapping)
- **Availability varies** by token:
  - Some have only RFQ
  - Some have only pools (with wrapping)
  - Some have both (aggregator picks best)
- Our aggregator API call handles ALL of this automatically
- We just request: "Give me price for this token in USDT"
- KyberSwap figures out: best route (RFQ or pools) → wrapping if needed → price

### For Jupiter (Solana):
- **ALL xStocks tokens are rebasing** BUT use **ScaledUI** (token2024 standard)
- **NO wrapping needed** - rebasing handled natively! 🎉
- Automatically checks **both Raydium pools AND JupZ RFQ**
- Returns best available price
- We don't need to specify which to use
- Jupiter optimizes the route for us
- Much simpler than Ethereum!

---

## 🔧 What Our Code Does

### KyberSwap Route Detection:
```typescript
// Check if route includes RFQ
const hasRFQ = routeSummary.route.some(path =>
  path.some(hop => hop.poolType === 'rfq' || hop.exchange.toLowerCase().includes('rfq'))
);
```

This detects when RFQ is used and shows a purple badge in the UI!

### Price Calculation:
Both DEXes return `amountOutUsd` - we use this directly:
```typescript
const price = parseFloat(routeSummary.amountOutUsd);
```

No need to manually calculate - the aggregator does it! ✅

---

## 💡 Key Takeaways

### Rebasing Technology:
1. **Ethereum (ALL tokens)**: Rebasing requires wrapping for pool trading, but RFQ can trade directly
2. **Solana (ALL tokens)**: ScaledUI in token2024 standard - NO wrapping ever needed!

### Liquidity Sources:
1. **KyberSwap**: May use RFQ only, pools only, or both (varies by token)
2. **Jupiter**: May use Raydium pools, JupZ RFQ, or both (varies by token)

### Automation:
1. **Wrapped Token Handling**: Automatic via aggregator APIs (Ethereum only)
2. **RFQ Support**: Automatic - we just detect it in the response
3. **Best Route Selection**: Automatic - aggregators optimize for us
4. **Price Calculation**: Simple - APIs return USD values directly

**Bottom Line:** The aggregator APIs abstract away all the complexity. We just need correct token addresses! 🎉

**Solana Advantage:** Thanks to ScaledUI technology, Solana xStocks are simpler to trade (no wrapping) while still maintaining rebasing functionality!

---

## 🐛 Why It Was Failing Before

1. ❌ **Wrong Solana addresses** (Ethereum format with `0x`)
   - Now fixed with correct base58 Solana addresses ✅

2. ❌ **Old Jupiter API endpoint**
   - Now using `quote-api.jup.ag/v6` ✅

3. ❌ **Wrong CEX trading pairs** (missing 'X')
   - Now using `TSLAXUSDT` instead of `TSLAUSDT` ✅

**All fixed! Should work now.** 🚀
