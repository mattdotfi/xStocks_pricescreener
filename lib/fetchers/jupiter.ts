import axios from 'axios';
import { Price } from '@/types/price';
import { API_CONFIG, REFERENCE_TOKENS } from '@/config/tokens';

export interface JupiterQuoteResponse {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  platformFee: {
    amount: string;
    feeBps: number;
  } | null;
  priceImpactPct: string;
  routePlan: Array<{
    swapInfo: {
      ammKey: string;
      label: string;
      inputMint: string;
      outputMint: string;
      inAmount: string;
      outAmount: string;
      feeAmount: string;
      feeMint: string;
    };
    percent: number;
  }>;
  contextSlot: number;
  timeTaken: number;
}

export interface JupiterPriceResponse {
  data: {
    [tokenAddress: string]: {
      id: string;
      mintSymbol: string;
      vsToken: string;
      vsTokenSymbol: string;
      price: number;
      extraInfo?: any;
    };
  };
  timeTaken: number;
}

/**
 * Fetch price from Jupiter aggregator using the quote API
 * @param tokenAddress - Token address on Solana
 * @param tokenSymbol - Token symbol for logging
 * @param amountIn - Amount in lamports (default 1 token = 1000000 assuming 6 decimals)
 * @returns Price object or null if fetch fails
 */
export async function fetchJupiterPriceViaQuote(
  tokenAddress: string,
  tokenSymbol: string,
  amountIn: number = 1000000 // 1 token with 6 decimals (common for Solana tokens)
): Promise<Price | null> {
  try {
    const url = `${API_CONFIG.jupiter.apiUrl}${API_CONFIG.jupiter.quoteEndpoint}`;

    const response = await axios.get<JupiterQuoteResponse>(url, {
      params: {
        inputMint: tokenAddress,
        outputMint: REFERENCE_TOKENS.solana.USDC,
        amount: amountIn,
        slippageBps: 50, // 0.5% slippage
      },
      timeout: 15000,
    });

    if (!response.data || !response.data.outAmount) {
      console.error(`Jupiter API error for ${tokenSymbol}: No quote data`);
      return null;
    }

    // Calculate price
    // outAmount is in USDC (6 decimals), inAmount is in token decimals
    const outAmount = parseInt(response.data.outAmount);
    const inAmount = parseInt(response.data.inAmount);

    // Price per token in USDC
    const price = (outAmount / 1000000) / (inAmount / 1000000);

    // Get liquidity sources
    const sources = response.data.routePlan.map(route => route.swapInfo.label);

    return {
      symbol: tokenSymbol,
      price: price,
      timestamp: Date.now(),
      source: `Jupiter (${sources.join(', ')})`,
      sourceType: 'DEX',
      liquidity: outAmount / 1000000, // Approximate
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Error fetching Jupiter quote for ${tokenSymbol}:`, error.response?.data || error.message);
    } else {
      console.error(`Error fetching Jupiter quote for ${tokenSymbol}:`, error);
    }
    return null;
  }
}

/**
 * Fetch price from Jupiter using the simpler price API
 * @param tokenAddress - Token address on Solana
 * @param tokenSymbol - Token symbol for logging
 * @returns Price object or null if fetch fails
 */
export async function fetchJupiterPrice(
  tokenAddress: string,
  tokenSymbol: string
): Promise<Price | null> {
  try {
    const url = `${API_CONFIG.jupiter.apiUrl}${API_CONFIG.jupiter.priceEndpoint}`;

    const response = await axios.get<JupiterPriceResponse>(url, {
      params: {
        ids: tokenAddress,
        vsToken: REFERENCE_TOKENS.solana.USDC,
      },
      timeout: 10000,
    });

    if (!response.data || !response.data.data || !response.data.data[tokenAddress]) {
      console.error(`Jupiter price API error for ${tokenSymbol}: No price data`);
      // Fallback to quote API
      return fetchJupiterPriceViaQuote(tokenAddress, tokenSymbol);
    }

    const priceData = response.data.data[tokenAddress];

    return {
      symbol: tokenSymbol,
      price: priceData.price,
      timestamp: Date.now(),
      source: 'Jupiter',
      sourceType: 'DEX',
    };
  } catch (error) {
    console.error(`Error fetching Jupiter price for ${tokenSymbol}, trying quote API:`, error);
    // Fallback to quote API
    return fetchJupiterPriceViaQuote(tokenAddress, tokenSymbol);
  }
}

/**
 * Fetch prices for multiple tokens from Jupiter
 * @param tokens - Array of {address, symbol} objects
 * @returns Array of Price objects (nulls for failed fetches)
 */
export async function fetchJupiterPrices(
  tokens: Array<{ address: string; symbol: string }>
): Promise<(Price | null)[]> {
  const promises = tokens.map(token => fetchJupiterPrice(token.address, token.symbol));
  return Promise.all(promises);
}
