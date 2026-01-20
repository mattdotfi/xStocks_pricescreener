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

    // Check for API key (required as of Jan 31, 2026)
    const jupiterApiKey = process.env.JUPITER_API_KEY;

    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json',
      'Accept-Language': 'en-US,en;q=0.9',
    };

    // Add API key header if available
    if (jupiterApiKey) {
      headers['x-api-key'] = jupiterApiKey;
    }

    const response = await axios.get<JupiterQuoteResponse>(url, {
      params: {
        inputMint: tokenAddress,
        outputMint: REFERENCE_TOKENS.solana.USDC,
        amount: amountIn,
        slippageBps: 50, // 0.5% slippage
      },
      headers,
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
      if (error.response?.status === 401) {
        console.error(`Jupiter API error for ${tokenSymbol}: Unauthorized. API key required. Get one at https://portal.jup.ag and add to .env as JUPITER_API_KEY`);
      } else {
        console.error(`Error fetching Jupiter quote for ${tokenSymbol}:`, error.response?.data || error.message);
      }
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
  // The price API endpoint now requires authentication
  // Use quote API directly for public price data
  return fetchJupiterPriceViaQuote(tokenAddress, tokenSymbol);
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
