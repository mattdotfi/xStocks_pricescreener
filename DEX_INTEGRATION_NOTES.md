# DEX Integration - How xStocks Tokens Work

## 🔍 Important Context About xStocks Tokens

### What are Rebasing Tokens?
Some xStocks tokens (TSLAx, NVDAx, SPYx) are **rebasing tokens**, which means their balance automatically adjusts to reflect the price of the underlying stock. This creates special challenges for DEX trading.

---

## 🔷 KyberSwap (Ethereum) Integration

### How It Works:

#### **Wrapped Token Routing**
For rebasing tokens (SPYx, NVDAx, TSLAx):
1. **Token is wrapped** before trading on Uniswap V3 pools
2. **Trade happens** with wrapped version
3. **Token is unwrapped** at the end of the route
4. **Final price** reflects the unwrapped token value

**Example Route:**
```
User Token → Wrap Contract → Uniswap V3 Pool → Unwrap Contract → USDT
```

KyberSwap's aggregator automatically handles this entire route!

#### **RFQ (Request for Quote) Support**
For AAPLx:
- Uses **UniX** (Uniswap RFQ aggregator)
- Gets quotes directly from market makers
- Often provides better pricing than pools
- Our code detects RFQ routes and shows a badge

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

Jupiter aggregates multiple liquidity sources and picks the best:

#### **Raydium (Pools)**
- Traditional AMM pools
- On-chain liquidity
- Standard swap routing

#### **JupZ (RFQ)**
- Request for Quote system
- Off-chain market makers
- Often better for larger trades

### What Our Code Does:
```typescript
// Requests a quote from xStocks token → USDC
inputMint: tokenAddress,      // xStocks contract (e.g., NVDAx)
outputMint: USDC,            // Target USDC
amount: 1 token              // Quote for 1 token

// Jupiter automatically:
// 1. Checks Raydium pools
// 2. Checks JupZ RFQ quotes
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

### For KyberSwap:
- **Rebasing tokens** (TSLAx, NVDAx, SPYx) need wrapping/unwrapping
- **Non-rebasing** (AAPLx) can use direct RFQ
- Our aggregator API call handles ALL of this automatically
- We just request: "Give me price for this token in USDT"
- KyberSwap figures out: wrap → route → unwrap → price

### For Jupiter:
- Automatically checks **both pools AND RFQ**
- Returns best available price
- We don't need to specify which to use
- Jupiter optimizes the route for us

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

1. **Wrapped Token Handling**: Automatic via aggregator APIs
2. **RFQ Support**: Automatic - we just detect it in the response
3. **Best Route Selection**: Automatic - aggregators optimize for us
4. **Price Calculation**: Simple - APIs return USD values directly

**Bottom Line:** The aggregator APIs abstract away all the complexity. We just need correct token addresses! 🎉

---

## 🐛 Why It Was Failing Before

1. ❌ **Wrong Solana addresses** (Ethereum format with `0x`)
   - Now fixed with correct base58 Solana addresses ✅

2. ❌ **Old Jupiter API endpoint**
   - Now using `quote-api.jup.ag/v6` ✅

3. ❌ **Wrong CEX trading pairs** (missing 'X')
   - Now using `TSLAXUSDT` instead of `TSLAUSDT` ✅

**All fixed! Should work now.** 🚀
