import { Price, PriceComparison, ArbitrageOpportunity } from '@/types/price';
import { TOKENS, TokenConfig } from '@/config/tokens';
import { fetchBybitPrice } from './fetchers/bybit';
// import { fetchKrakenPrice } from './fetchers/kraken'; // Disabled: xStocks not available on Kraken
import { fetchKyberSwapPrice } from './fetchers/kyberswap';
import { fetchJupiterPrice } from './fetchers/jupiter';
import { fetchStockPrice } from './fetchers/stocks';

/**
 * Fetch all prices for a single token across all platforms
 * @param tokenKey - Key from TOKENS config (e.g., "TSLA")
 * @returns PriceComparison object with all prices and arbitrage opportunities
 */
export async function fetchAllPricesForToken(tokenKey: string): Promise<PriceComparison> {
  const token = TOKENS[tokenKey];

  if (!token) {
    throw new Error(`Token ${tokenKey} not found in configuration`);
  }

  // Fetch all prices in parallel where possible
  // Note: Kraken removed - xStocks tokens not available on Kraken
  const [stockPrice, bybitPrice, kyberswapPrice, jupiterPrice] = await Promise.all([
    fetchStockPrice(token.stockSymbol),
    fetchBybitPrice(token.cex.bybit),
    fetchKyberSwapPrice(token.ethereum.address, token.symbol),
    fetchJupiterPrice(token.solana.address, token.symbol),
  ]);

  const comparison: PriceComparison = {
    symbol: token.symbol,
    stockSymbol: token.stockSymbol,
    stockPrice,
    prices: {
      bybit: bybitPrice,
      kraken: null, // Disabled: xStocks not available on Kraken
      kyberswap: kyberswapPrice,
      jupiter: jupiterPrice,
    },
    arbitrageOpportunities: [],
  };

  // Calculate arbitrage opportunities
  comparison.arbitrageOpportunities = findArbitrageOpportunities(comparison);

  return comparison;
}

/**
 * Fetch all prices for all configured tokens
 * @returns Array of PriceComparison objects
 */
export async function fetchAllPrices(): Promise<PriceComparison[]> {
  const tokenKeys = Object.keys(TOKENS);
  const comparisons: PriceComparison[] = [];

  // Fetch sequentially to respect rate limits (especially for stock API)
  for (const tokenKey of tokenKeys) {
    try {
      const comparison = await fetchAllPricesForToken(tokenKey);
      comparisons.push(comparison);

      // Add delay between tokens to respect rate limits
      if (tokenKeys.indexOf(tokenKey) < tokenKeys.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 8000));
      }
    } catch (error) {
      console.error(`Error fetching prices for ${tokenKey}:`, error);
    }
  }

  return comparisons;
}

/**
 * Find arbitrage opportunities from a price comparison
 * @param comparison - PriceComparison object
 * @param minSpreadPercent - Minimum spread percentage to consider (default 0.5%)
 * @returns Array of ArbitrageOpportunity objects
 */
export function findArbitrageOpportunities(
  comparison: PriceComparison,
  minSpreadPercent: number = 0.5
): ArbitrageOpportunity[] {
  const opportunities: ArbitrageOpportunity[] = [];

  // Collect all valid prices
  const allPrices: Array<{ source: string; price: Price }> = [];

  if (comparison.stockPrice) {
    allPrices.push({ source: 'Stock Market', price: comparison.stockPrice });
  }

  Object.entries(comparison.prices).forEach(([source, price]) => {
    if (price) {
      allPrices.push({ source, price });
    }
  });

  // Compare all pairs
  for (let i = 0; i < allPrices.length; i++) {
    for (let j = i + 1; j < allPrices.length; j++) {
      const source1 = allPrices[i];
      const source2 = allPrices[j];

      const price1 = source1.price.price;
      const price2 = source2.price.price;

      // Calculate spread
      const spreadPercent = Math.abs((price2 - price1) / price1) * 100;

      if (spreadPercent >= minSpreadPercent) {
        // Determine buy and sell sides
        const isBuyFrom1 = price1 < price2;

        opportunities.push({
          symbol: comparison.symbol,
          buyFrom: isBuyFrom1 ? source1.source : source2.source,
          sellTo: isBuyFrom1 ? source2.source : source1.source,
          buyPrice: isBuyFrom1 ? price1 : price2,
          sellPrice: isBuyFrom1 ? price2 : price1,
          spreadPercent,
          potentialProfit: isBuyFrom1 ? price2 - price1 : price1 - price2,
          timestamp: Date.now(),
        });
      }
    }
  }

  // Sort by spread percentage (highest first)
  opportunities.sort((a, b) => b.spreadPercent - a.spreadPercent);

  return opportunities;
}

/**
 * Get the best arbitrage opportunities across all tokens
 * @param comparisons - Array of PriceComparison objects
 * @param topN - Number of top opportunities to return (default 10)
 * @returns Array of best ArbitrageOpportunity objects
 */
export function getBestArbitrageOpportunities(
  comparisons: PriceComparison[],
  topN: number = 10
): ArbitrageOpportunity[] {
  const allOpportunities = comparisons.flatMap(c => c.arbitrageOpportunities);

  // Sort by spread percentage
  allOpportunities.sort((a, b) => b.spreadPercent - a.spreadPercent);

  return allOpportunities.slice(0, topN);
}

/**
 * Calculate summary statistics for a price comparison
 * @param comparison - PriceComparison object
 * @returns Summary statistics
 */
export function getPriceStatistics(comparison: PriceComparison) {
  const prices: number[] = [];

  if (comparison.stockPrice) prices.push(comparison.stockPrice.price);
  Object.values(comparison.prices).forEach(p => {
    if (p) prices.push(p.price);
  });

  if (prices.length === 0) {
    return null;
  }

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
  const spread = ((max - min) / min) * 100;

  return {
    min,
    max,
    avg,
    spread,
    priceCount: prices.length,
  };
}
