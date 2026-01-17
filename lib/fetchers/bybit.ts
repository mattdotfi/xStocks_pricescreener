import axios from 'axios';
import { Price, PriceFetchError } from '@/types/price';
import { API_CONFIG } from '@/config/tokens';

export interface BybitTickerResponse {
  retCode: number;
  retMsg: string;
  result: {
    category: string;
    list: Array<{
      symbol: string;
      lastPrice: string;
      prevPrice24h: string;
      price24hPcnt: string;
      highPrice24h: string;
      lowPrice24h: string;
      turnover24h: string;
      volume24h: string;
    }>;
  };
  time: number;
}

/**
 * Fetch price from Bybit for a given trading pair
 * @param symbol - Trading pair symbol (e.g., "TSLAUSDT")
 * @returns Price object or null if fetch fails
 */
export async function fetchBybitPrice(symbol: string): Promise<Price | null> {
  try {
    const url = `${API_CONFIG.bybit.baseUrl}${API_CONFIG.bybit.publicEndpoint}`;

    const response = await axios.get<BybitTickerResponse>(url, {
      params: {
        category: 'spot',
        symbol: symbol,
      },
      timeout: 10000,
    });

    if (response.data.retCode !== 0 || !response.data.result.list.length) {
      console.error(`Bybit API error for ${symbol}:`, response.data.retMsg);
      return null;
    }

    const ticker = response.data.result.list[0];

    return {
      symbol,
      price: parseFloat(ticker.lastPrice),
      timestamp: response.data.time,
      source: 'Bybit',
      sourceType: 'CEX',
      volume24h: parseFloat(ticker.volume24h),
    };
  } catch (error) {
    console.error(`Error fetching Bybit price for ${symbol}:`, error);
    return null;
  }
}

/**
 * Fetch prices for multiple symbols from Bybit
 * @param symbols - Array of trading pair symbols
 * @returns Array of Price objects (nulls for failed fetches)
 */
export async function fetchBybitPrices(symbols: string[]): Promise<(Price | null)[]> {
  const promises = symbols.map(symbol => fetchBybitPrice(symbol));
  return Promise.all(promises);
}
