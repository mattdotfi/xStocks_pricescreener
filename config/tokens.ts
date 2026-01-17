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
    kraken: string; // Trading pair on Kraken
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
      bybit: 'TSLAUSDT',
      kraken: 'TSLAUSD',
    },
  },
  NVDA: {
    symbol: 'NVDAx',
    stockSymbol: 'NVDA',
    ethereum: {
      address: '0x93e62845c1dd5822ebc807ab71a5fb750decd15a',
    },
    solana: {
      address: '0xc845b2894dbddd03858fd2d643b4ef725fe0849d',
    },
    cex: {
      bybit: 'NVDAUSDT',
      kraken: 'NVDAUSD',
    },
  },
  SPY: {
    symbol: 'SPYx',
    stockSymbol: 'SPY',
    ethereum: {
      address: '0xc88fcd8b874fdb3256e8b55b3decb8c24eab4c02',
    },
    solana: {
      address: '0x90a2a4c76b5d8c0bc892a69ea28aa775a8f2dd48',
    },
    cex: {
      bybit: 'SPYUSDT',
      kraken: 'SPYUSD',
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
      bybit: 'AAPLUSDT',
      kraken: 'AAPLUSD',
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
  kraken: {
    baseUrl: 'https://api.kraken.com',
    publicEndpoint: '/0/public/Ticker',
  },
  kyberswap: {
    apiUrl: 'https://aggregator-api.kyberswap.com',
    ethereumChainId: '1', // Ethereum mainnet
  },
  jupiter: {
    apiUrl: 'https://api.jup.ag',
    quoteEndpoint: '/quote/v6/quote',
    priceEndpoint: '/price/v2',
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
