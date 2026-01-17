import axios from 'axios';
import { Price } from '@/types/price';
import { API_CONFIG } from '@/config/tokens';

export interface TwelveDataQuoteResponse {
  symbol: string;
  name: string;
  exchange: string;
  mic_code: string;
  currency: string;
  datetime: string;
  timestamp: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  previous_close: string;
  change: string;
  percent_change: string;
  average_volume: string;
  is_market_open: boolean;
  fifty_two_week: {
    low: string;
    high: string;
    low_change: string;
    high_change: string;
    low_change_percent: string;
    high_change_percent: string;
    range: string;
  };
}

export interface TwelveDataPriceResponse {
  price: string;
  symbol: string;
}

/**
 * Fetch stock price from Twelve Data API
 * @param symbol - Stock symbol (e.g., "TSLA", "NVDA")
 * @param apiKey - Twelve Data API key (optional, will try to use from env)
 * @returns Price object or null if fetch fails
 */
export async function fetchStockPrice(
  symbol: string,
  apiKey?: string
): Promise<Price | null> {
  const key = apiKey || process.env.TWELVE_DATA_API_KEY;

  if (!key) {
    console.error('Twelve Data API key not found. Please set TWELVE_DATA_API_KEY in .env file');
    return null;
  }

  try {
    // First try the real-time price endpoint (faster)
    const priceUrl = `${API_CONFIG.twelveData.apiUrl}/price`;

    const priceResponse = await axios.get<TwelveDataPriceResponse>(priceUrl, {
      params: {
        symbol: symbol,
        apikey: key,
      },
      timeout: 10000,
    });

    if (priceResponse.data && priceResponse.data.price) {
      return {
        symbol,
        price: parseFloat(priceResponse.data.price),
        timestamp: Date.now(),
        source: 'Stock Market (Twelve Data)',
        sourceType: 'STOCK',
      };
    }

    // Fallback to quote endpoint for more detailed data
    const quoteUrl = `${API_CONFIG.twelveData.apiUrl}/quote`;

    const quoteResponse = await axios.get<TwelveDataQuoteResponse>(quoteUrl, {
      params: {
        symbol: symbol,
        apikey: key,
      },
      timeout: 10000,
    });

    if (quoteResponse.data && quoteResponse.data.close) {
      return {
        symbol,
        price: parseFloat(quoteResponse.data.close),
        timestamp: quoteResponse.data.timestamp * 1000,
        source: `Stock Market (${quoteResponse.data.exchange})`,
        sourceType: 'STOCK',
        volume24h: parseFloat(quoteResponse.data.volume),
      };
    }

    console.error(`Twelve Data API: No price data for ${symbol}`);
    return null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        console.error(`Twelve Data API rate limit exceeded for ${symbol}`);
      } else if (error.response?.status === 401) {
        console.error(`Twelve Data API authentication failed. Check your API key.`);
      } else {
        console.error(`Error fetching stock price for ${symbol}:`, error.response?.data || error.message);
      }
    } else {
      console.error(`Error fetching stock price for ${symbol}:`, error);
    }
    return null;
  }
}

/**
 * Fetch prices for multiple stocks
 * @param symbols - Array of stock symbols
 * @param apiKey - Twelve Data API key (optional)
 * @returns Array of Price objects (nulls for failed fetches)
 */
export async function fetchStockPrices(
  symbols: string[],
  apiKey?: string
): Promise<(Price | null)[]> {
  // Add delay between requests to respect rate limits (free tier: 8 requests/min)
  const results: (Price | null)[] = [];

  for (const symbol of symbols) {
    const price = await fetchStockPrice(symbol, apiKey);
    results.push(price);

    // Add 8 second delay between requests for free tier (8 req/min = 1 req per 7.5 seconds)
    if (symbols.indexOf(symbol) < symbols.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 8000));
    }
  }

  return results;
}

/**
 * Check if the stock market is currently open
 * @param symbol - Stock symbol
 * @param apiKey - Twelve Data API key
 * @returns Boolean indicating if market is open, or null if check fails
 */
export async function isMarketOpen(
  symbol: string,
  apiKey?: string
): Promise<boolean | null> {
  const key = apiKey || process.env.TWELVE_DATA_API_KEY;

  if (!key) {
    return null;
  }

  try {
    const url = `${API_CONFIG.twelveData.apiUrl}/quote`;

    const response = await axios.get<TwelveDataQuoteResponse>(url, {
      params: {
        symbol: symbol,
        apikey: key,
      },
      timeout: 10000,
    });

    return response.data?.is_market_open ?? null;
  } catch (error) {
    console.error(`Error checking market status for ${symbol}:`, error);
    return null;
  }
}
