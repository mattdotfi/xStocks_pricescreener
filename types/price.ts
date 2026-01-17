export interface Price {
  symbol: string;
  price: number;
  timestamp: number;
  source: string;
  sourceType: 'CEX' | 'DEX' | 'STOCK';
  volume24h?: number;
  liquidity?: number;
  isRFQ?: boolean; // For KyberSwap RFQ quotes
}

export interface PriceComparison {
  symbol: string;
  stockSymbol: string;
  stockPrice: Price | null;
  prices: {
    bybit: Price | null;
    kraken: Price | null;
    kyberswap: Price | null;
    jupiter: Price | null;
  };
  arbitrageOpportunities: ArbitrageOpportunity[];
}

export interface ArbitrageOpportunity {
  symbol: string;
  buyFrom: string;
  sellTo: string;
  buyPrice: number;
  sellPrice: number;
  spreadPercent: number;
  potentialProfit: number; // per token
  timestamp: number;
}

export interface PriceFetchError {
  symbol: string;
  source: string;
  error: string;
  timestamp: number;
}
