import axios from 'axios';
import { Price } from '@/types/price';
import { API_CONFIG } from '@/config/tokens';

export interface KrakenTickerResponse {
  error: string[];
  result: {
    [key: string]: {
      a: [string, string, string]; // ask [price, whole lot volume, lot volume]
      b: [string, string, string]; // bid [price, whole lot volume, lot volume]
      c: [string, string]; // last trade [price, lot volume]
      v: [string, string]; // volume [today, last 24 hours]
      p: [string, string]; // volume weighted average price [today, last 24 hours]
      t: [number, number]; // number of trades [today, last 24 hours]
      l: [string, string]; // low [today, last 24 hours]
      h: [string, string]; // high [today, last 24 hours]
      o: string; // today's opening price
    };
  };
}

/**
 * Fetch price from Kraken for a given trading pair
 * Note: Kraken uses different pair naming conventions
 * @param symbol - Trading pair symbol (e.g., "TSLAUSD")
 * @returns Price object or null if fetch fails
 */
export async function fetchKrakenPrice(symbol: string): Promise<Price | null> {
  try {
    const url = `${API_CONFIG.kraken.baseUrl}${API_CONFIG.kraken.publicEndpoint}`;

    // Kraken might use different pair formats, try both
    const pairVariants = [
      symbol,
      symbol.replace('USD', '/USD'),
      `X${symbol}`,
    ];

    let tickerData = null;
    let usedPair = '';

    // Try different pair formats
    for (const pair of pairVariants) {
      try {
        const response = await axios.get<KrakenTickerResponse>(url, {
          params: {
            pair: pair,
          },
          timeout: 10000,
        });

        if (response.data.error.length === 0 && Object.keys(response.data.result).length > 0) {
          usedPair = Object.keys(response.data.result)[0];
          tickerData = response.data.result[usedPair];
          break;
        }
      } catch (err) {
        // Try next variant
        continue;
      }
    }

    if (!tickerData) {
      console.error(`Kraken: No data found for ${symbol} (tried variants: ${pairVariants.join(', ')})`);
      return null;
    }

    // Use the last trade price
    const lastPrice = parseFloat(tickerData.c[0]);
    const volume24h = parseFloat(tickerData.v[1]);

    return {
      symbol,
      price: lastPrice,
      timestamp: Date.now(),
      source: 'Kraken',
      sourceType: 'CEX',
      volume24h,
    };
  } catch (error) {
    console.error(`Error fetching Kraken price for ${symbol}:`, error);
    return null;
  }
}

/**
 * Fetch prices for multiple symbols from Kraken
 * @param symbols - Array of trading pair symbols
 * @returns Array of Price objects (nulls for failed fetches)
 */
export async function fetchKrakenPrices(symbols: string[]): Promise<(Price | null)[]> {
  const promises = symbols.map(symbol => fetchKrakenPrice(symbol));
  return Promise.all(promises);
}
