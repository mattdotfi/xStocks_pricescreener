'use client';

import { Price } from '@/types/price';

interface PriceCardProps {
  label: string;
  price: Price | null;
  stockPrice?: number;
}

export function PriceCard({ label, price, stockPrice }: PriceCardProps) {
  if (!price) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="text-sm text-gray-400 mb-2">{label}</div>
        <div className="text-lg text-gray-600">No data</div>
      </div>
    );
  }

  // Calculate difference from stock price if available
  let diffPercent = null;
  let diffColor = 'text-gray-400';

  if (stockPrice && price.sourceType !== 'STOCK') {
    diffPercent = ((price.price - stockPrice) / stockPrice) * 100;
    diffColor = diffPercent > 0 ? 'text-red-400' : 'text-green-400';
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div className="text-sm text-gray-400">{label}</div>
        {price.isRFQ && (
          <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded">
            RFQ
          </span>
        )}
      </div>

      <div className="text-2xl font-bold mb-1">
        ${price.price.toFixed(4)}
      </div>

      {diffPercent !== null && (
        <div className={`text-sm ${diffColor}`}>
          {diffPercent > 0 ? '+' : ''}
          {diffPercent.toFixed(2)}% vs stock
        </div>
      )}

      {price.volume24h && (
        <div className="text-xs text-gray-500 mt-2">
          Vol: ${price.volume24h.toLocaleString()}
        </div>
      )}

      <div className="text-xs text-gray-500 mt-1">
        {new Date(price.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
}
