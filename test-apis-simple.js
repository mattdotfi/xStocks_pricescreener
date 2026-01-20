/**
 * Simple API test script for KyberSwap and Jupiter
 * Run with: node test-apis-simple.js
 */

const axios = require('axios');

// Token addresses
const TOKENS = {
  TSLAx: {
    ethereum: '0x8ad3c73f833d3f9a523ab01476625f269aeb7cf0',
    solana: 'XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB',
  }
};

const USDT_ETH = '0xdac17f958d2ee523a2206206994597c13d831ec7';
const USDC_SOL = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

async function testKyberSwap() {
  console.log('\n=== Testing KyberSwap ===');
  try {
    const url = 'https://aggregator-api.kyberswap.com/1/api/v1/routes';
    const params = {
      tokenIn: TOKENS.TSLAx.ethereum,
      tokenOut: USDT_ETH,
      amountIn: '1000000000000000000', // 1 token
      saveGas: false,
      gasInclude: true,
      clientData: JSON.stringify({ source: 'price-screener' }),
    };

    console.log('Requesting:', url);
    console.log('Params:', params);

    const response = await axios.get(url, { params, timeout: 15000 });

    if (response.data.code === 0 && response.data.data) {
      const routeSummary = response.data.data.routeSummary;
      console.log('✅ SUCCESS');
      console.log('Price (USD):', routeSummary.amountOutUsd);
      console.log('Amount In:', routeSummary.amountIn);
      console.log('Amount Out:', routeSummary.amountOut);
    } else {
      console.log('❌ API Error:', response.data.message);
    }
  } catch (error) {
    console.log('❌ Request Failed');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
  }
}

async function testJupiter() {
  console.log('\n=== Testing Jupiter ===');
  try {
    const url = 'https://api.jup.ag/swap/v1/quote';
    const params = {
      inputMint: TOKENS.TSLAx.solana,
      outputMint: USDC_SOL,
      amount: 1000000, // 1 token (6 decimals)
      slippageBps: 50,
    };

    console.log('Requesting:', url);
    console.log('Params:', params);

    const response = await axios.get(url, { params, timeout: 15000 });

    if (response.data && response.data.outAmount) {
      const outAmount = parseInt(response.data.outAmount);
      const inAmount = parseInt(response.data.inAmount);
      const price = (outAmount / 1000000) / (inAmount / 1000000);

      console.log('✅ SUCCESS');
      console.log('Price (USD):', price);
      console.log('In Amount:', response.data.inAmount);
      console.log('Out Amount:', response.data.outAmount);
    } else {
      console.log('❌ No quote data');
    }
  } catch (error) {
    console.log('❌ Request Failed');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
  }
}

async function runTests() {
  console.log('Testing APIs with TSLAx token...\n');
  await testKyberSwap();
  await testJupiter();
  console.log('\n=== Test Complete ===\n');
}

runTests();
