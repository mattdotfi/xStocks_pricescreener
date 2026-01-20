/**
 * Test with proper headers and user agent
 */

const axios = require('axios');

const TOKENS = {
  TSLAx: {
    ethereum: '0x8ad3c73f833d3f9a523ab01476625f269aeb7cf0',
    solana: 'XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB',
  }
};

const USDT_ETH = '0xdac17f958d2ee523a2206206994597c13d831ec7';
const USDC_SOL = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

async function testKyberSwapWithHeaders() {
  console.log('\n=== Testing KyberSwap with Headers ===');
  try {
    const url = 'https://aggregator-api.kyberswap.com/1/api/v1/routes';

    const response = await axios.get(url, {
      params: {
        tokenIn: TOKENS.TSLAx.ethereum,
        tokenOut: USDT_ETH,
        amountIn: '1000000000000000000',
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Origin': 'https://kyberswap.com',
        'Referer': 'https://kyberswap.com/',
      },
      timeout: 15000
    });

    console.log('✅ SUCCESS with headers!');
    console.log('Status:', response.status);
    if (response.data.code === 0) {
      console.log('Price (USD):', response.data.data.routeSummary.amountOutUsd);
    }
  } catch (error) {
    console.log('❌ Still failed');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

async function testJupiterWithHeaders() {
  console.log('\n=== Testing Jupiter with Headers ===');
  try {
    const url = 'https://api.jup.ag/swap/v1/quote';

    const response = await axios.get(url, {
      params: {
        inputMint: TOKENS.TSLAx.solana,
        outputMint: USDC_SOL,
        amount: 1000000,
        slippageBps: 50,
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
      timeout: 15000
    });

    console.log('✅ SUCCESS with headers!');
    console.log('Status:', response.status);
    const outAmount = parseInt(response.data.outAmount);
    const inAmount = parseInt(response.data.inAmount);
    const price = (outAmount / 1000000) / (inAmount / 1000000);
    console.log('Price (USD):', price);
  } catch (error) {
    console.log('❌ Still failed');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

async function runTests() {
  await testKyberSwapWithHeaders();
  await testJupiterWithHeaders();
  console.log('\n=== Done ===\n');
}

runTests();
