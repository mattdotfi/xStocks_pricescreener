import axios from 'axios';
import { Price } from '@/types/price';
import { API_CONFIG, REFERENCE_TOKENS } from '@/config/tokens';

export interface KyberSwapRouteResponse {
  code: number;
  message: string;
  data: {
    routeSummary: {
      tokenIn: string;
      amountIn: string;
      amountInUsd: string;
      tokenOut: string;
      amountOut: string;
      amountOutUsd: string;
      gas: string;
      gasPrice: string;
      gasUsd: string;
      extraFee: {
        feeAmount: string;
        chargeFeeBy: string;
        isInBps: boolean;
        feeReceiver: string;
      };
      route: Array<Array<{
        pool: string;
        tokenIn: string;
        tokenOut: string;
        limitReturnAmount: string;
        swapAmount: string;
        amountOut: string;
        exchange: string;
        poolLength: number;
        poolType: string;
        extra: any;
      }>>;
    };
    routerAddress: string;
  };
}

/**
 * Fetch price from KyberSwap aggregator (includes both pool and RFQ quotes)
 * @param tokenAddress - Token contract address on Ethereum
 * @param tokenSymbol - Token symbol for logging
 * @param amountIn - Amount to swap (in wei), default 1 token (assuming 18 decimals)
 * @returns Price object or null if fetch fails
 */
export async function fetchKyberSwapPrice(
  tokenAddress: string,
  tokenSymbol: string,
  amountIn: string = '1000000000000000000' // 1 token with 18 decimals
): Promise<Price | null> {
  try {
    const url = `${API_CONFIG.kyberswap.apiUrl}/${API_CONFIG.kyberswap.ethereumChainId}/api/v1/routes`;

    // Get quote for selling 1 token for USDT
    const response = await axios.get<KyberSwapRouteResponse>(url, {
      params: {
        tokenIn: tokenAddress,
        tokenOut: REFERENCE_TOKENS.ethereum.USDT,
        amountIn: amountIn,
        saveGas: false,
        gasInclude: true,
        // Setting clientData to get RFQ quotes if available
        clientData: JSON.stringify({
          source: 'price-screener',
        }),
      },
      timeout: 15000,
    });

    if (response.data.code !== 0 || !response.data.data) {
      console.error(`KyberSwap API error for ${tokenSymbol}:`, response.data.message);
      return null;
    }

    const routeSummary = response.data.data.routeSummary;

    // Calculate price: amountOut / amountIn (both in human readable format via USD)
    const amountOutUsd = parseFloat(routeSummary.amountOutUsd);
    const amountInUsd = parseFloat(routeSummary.amountInUsd);

    // Price is how much USD we get for the token
    const price = amountOutUsd;

    // Check if route includes RFQ
    const hasRFQ = routeSummary.route.some(path =>
      path.some(hop => hop.poolType === 'rfq' || hop.exchange.toLowerCase().includes('rfq'))
    );

    return {
      symbol: tokenSymbol,
      price: price,
      timestamp: Date.now(),
      source: 'KyberSwap',
      sourceType: 'DEX',
      isRFQ: hasRFQ,
      liquidity: amountOutUsd, // Approximate liquidity indicator
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Error fetching KyberSwap price for ${tokenSymbol}:`, error.response?.data || error.message);
    } else {
      console.error(`Error fetching KyberSwap price for ${tokenSymbol}:`, error);
    }
    return null;
  }
}

/**
 * Fetch prices for multiple tokens from KyberSwap
 * @param tokens - Array of {address, symbol} objects
 * @returns Array of Price objects (nulls for failed fetches)
 */
export async function fetchKyberSwapPrices(
  tokens: Array<{ address: string; symbol: string }>
): Promise<(Price | null)[]> {
  const promises = tokens.map(token => fetchKyberSwapPrice(token.address, token.symbol));
  return Promise.all(promises);
}

/**
 * Get detailed route information including all liquidity sources
 * @param tokenAddress - Token contract address
 * @param tokenSymbol - Token symbol
 * @returns Detailed route information
 */
export async function getKyberSwapRouteDetails(
  tokenAddress: string,
  tokenSymbol: string
): Promise<any> {
  try {
    const url = `${API_CONFIG.kyberswap.apiUrl}/${API_CONFIG.kyberswap.ethereumChainId}/api/v1/routes`;

    const response = await axios.get<KyberSwapRouteResponse>(url, {
      params: {
        tokenIn: tokenAddress,
        tokenOut: REFERENCE_TOKENS.ethereum.USDT,
        amountIn: '1000000000000000000',
        saveGas: false,
        gasInclude: true,
        clientData: JSON.stringify({
          source: 'price-screener',
        }),
      },
      timeout: 15000,
    });

    if (response.data.code === 0 && response.data.data) {
      return {
        symbol: tokenSymbol,
        routeSummary: response.data.data.routeSummary,
        sources: response.data.data.routeSummary.route.map(path =>
          path.map(hop => ({
            exchange: hop.exchange,
            poolType: hop.poolType,
            pool: hop.pool,
          }))
        ),
      };
    }

    return null;
  } catch (error) {
    console.error(`Error fetching KyberSwap route details for ${tokenSymbol}:`, error);
    return null;
  }
}
