export interface TokenConfig {
  symbol: string;
  stockSymbol: string;
  ethereum: {
    address: string;
  };
  solana: {
    address: string;
  };
  cex: {
    bybit: string; // Trading pair on Bybit
    // Note: Kraken removed - xStocks tokens not available on Kraken
  };
}

export const TOKENS: Record<string, TokenConfig> = {
  TSLA: {
    symbol: 'TSLAx',
    stockSymbol: 'TSLA',
    ethereum: {
      address: '0x8ad3c73f833d3f9a523ab01476625f269aeb7cf0',
    },
    solana: {
      address: 'XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB',
    },
    cex: {
      bybit: 'TSLAXUSDT',
    },
  },
  NVDA: {
    symbol: 'NVDAx',
    stockSymbol: 'NVDA',
    ethereum: {
      address: '0x93e62845c1dd5822ebc807ab71a5fb750decd15a',
    },
    solana: {
      address: 'Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh',
    },
    cex: {
      bybit: 'NVDAXUSDT',
    },
  },
  SPY: {
    symbol: 'SPYx',
    stockSymbol: 'SPY',
    ethereum: {
      address: '0xc88fcd8b874fdb3256e8b55b3decb8c24eab4c02',
    },
    solana: {
      address: 'XsoCS1TfEyfFhfvj8EtZ528L3CaKBDBRqRapnBbDF2W',
    },
    cex: {
      bybit: 'SPYXUSDT', // Note: Not actually listed on Bybit
    },
  },
  AAPL: {
    symbol: 'AAPLx',
    stockSymbol: 'AAPL',
    ethereum: {
      address: '0x9d275685dc284c8eb1c79f6aba7a63dc75ec890a',
    },
    solana: {
      address: 'XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp',
    },
    cex: {
      bybit: 'AAPLXUSDT', // Note: Not actually listed on Bybit
    },
  },
};

export const SUPPORTED_TOKENS = Object.keys(TOKENS);

// API Configuration
export const API_CONFIG = {
  bybit: {
    baseUrl: 'https://api.bybit.com',
    publicEndpoint: '/v5/market/tickers',
  },
  // Kraken removed - xStocks tokens not available on Kraken
  kyberswap: {
    apiUrl: 'https://aggregator-api.kyberswap.com',
    ethereumChainId: '1', // Ethereum mainnet
  },
  jupiter: {
    apiUrl: 'https://api.jup.ag/swap/v1',
    quoteEndpoint: '/quote',
    priceEndpoint: '/price',
  },
  twelveData: {
    apiUrl: 'https://api.twelvedata.com',
    // Note: User needs to set TWELVE_DATA_API_KEY in .env
  },
};

// Reference tokens for pricing
export const REFERENCE_TOKENS = {
  ethereum: {
    USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    USDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  },
  solana: {
    USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  },
};
