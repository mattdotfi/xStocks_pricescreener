'use client';

import { PriceComparison } from '@/types/price';
import { PriceCard } from './PriceCard';
import { ArbitrageTable } from './ArbitrageTable';

interface TokenComparisonProps {
  comparison: PriceComparison;
}

export function TokenComparison({ comparison }: TokenComparisonProps) {
  const stockPrice = comparison.stockPrice?.price;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {comparison.symbol}
          </h2>
          <p className="text-gray-400 text-sm">
            Stock: {comparison.stockSymbol}
          </p>
        </div>
        {comparison.stockPrice && (
          <div className="text-right">
            <div className="text-sm text-gray-400">Reference Price</div>
            <div className="text-3xl font-bold text-blue-400">
              ${comparison.stockPrice.price.toFixed(4)}
            </div>
          </div>
        )}
      </div>

      {/* Price Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <PriceCard
          label="Bybit (USDT)"
          price={comparison.prices.bybit}
          stockPrice={stockPrice}
        />
        <PriceCard
          label="KyberSwap (ETH)"
          price={comparison.prices.kyberswap}
          stockPrice={stockPrice}
        />
        <PriceCard
          label="Jupiter (SOL)"
          price={comparison.prices.jupiter}
          stockPrice={stockPrice}
        />
      </div>

      {/* Arbitrage Opportunities */}
      {comparison.arbitrageOpportunities.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-white mb-4">
            Arbitrage Opportunities ({comparison.arbitrageOpportunities.length})
          </h3>
          <ArbitrageTable opportunities={comparison.arbitrageOpportunities} />
        </div>
      )}
    </div>
  );
}
