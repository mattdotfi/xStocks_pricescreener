'use client';

import { useState, useEffect } from 'react';
import { PriceComparison } from '@/types/price';
import { TokenComparison } from '@/components/TokenComparison';
import { ArbitrageTable } from '@/components/ArbitrageTable';
import { getBestArbitrageOpportunities } from '@/lib/priceComparison';

export default function Home() {
  const [comparisons, setComparisons] = useState<PriceComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/prices');
      const data = await response.json();

      if (data.success) {
        setComparisons(data.data);
        setLastUpdate(new Date());
      } else {
        setError(data.error || 'Failed to fetch prices');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchPrices();
    }, 60000); // Refresh every 60 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const bestOpportunities = comparisons.length > 0
    ? getBestArbitrageOpportunities(comparisons, 5)
    : [];

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 shadow-xl">
          <h1 className="text-4xl font-bold text-white mb-2">
            xStocks Price Screener
          </h1>
          <p className="text-blue-100">
            Real-time price comparison and arbitrage detection for tokenized stocks
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-4">
            <button
              onClick={fetchPrices}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              {loading ? 'Loading...' : 'Refresh Prices'}
            </button>

            <label className="flex items-center gap-2 text-gray-300">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">Auto-refresh (60s)</span>
            </label>
          </div>

          {lastUpdate && (
            <div className="text-sm text-gray-400">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-4">
            <p className="text-red-200">
              <strong>Error:</strong> {error}
            </p>
            <p className="text-red-300 text-sm mt-2">
              Make sure you have set up your TWELVE_DATA_API_KEY in the .env file
            </p>
          </div>
        )}

        {/* Best Arbitrage Opportunities */}
        {bestOpportunities.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">
              Top Arbitrage Opportunities
            </h2>
            <ArbitrageTable opportunities={bestOpportunities} />
          </div>
        )}

        {/* Loading State */}
        {loading && comparisons.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-gray-400 mt-4">Fetching prices from all sources...</p>
            <p className="text-gray-500 text-sm mt-2">
              This may take 30-40 seconds due to API rate limits
            </p>
          </div>
        )}

        {/* Token Comparisons */}
        {comparisons.length > 0 && (
          <div className="space-y-8">
            {comparisons.map((comparison) => (
              <div
                key={comparison.symbol}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700"
              >
                <TokenComparison comparison={comparison} />
              </div>
            ))}
          </div>
        )}

        {/* Footer Info */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-sm text-gray-400">
          <h3 className="font-semibold text-white mb-2">Data Sources:</h3>
          <ul className="space-y-1">
            <li>• <strong>Bybit:</strong> Spot trading pairs (USDT)</li>
            <li>• <strong>Kraken Pro:</strong> Convert feature (USD)</li>
            <li>• <strong>KyberSwap:</strong> DEX aggregator on Ethereum (includes RFQ quotes)</li>
            <li>• <strong>Jupiter:</strong> DEX aggregator on Solana</li>
            <li>• <strong>Stock Market:</strong> Twelve Data API</li>
          </ul>
          <p className="mt-4 text-xs text-gray-500">
            Note: Prices are indicative and may not reflect actual executable prices. Always verify on the respective platforms before trading.
          </p>
        </div>
      </div>
    </div>
  );
}
