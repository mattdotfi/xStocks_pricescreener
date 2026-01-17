import { NextResponse } from 'next/server';
import { fetchAllPricesForToken } from '@/lib/priceComparison';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol: symbolParam } = await params;
    const symbol = symbolParam.toUpperCase();

    const comparison = await fetchAllPricesForToken(symbol);

    return NextResponse.json({
      success: true,
      data: comparison,
      timestamp: Date.now(),
    });
  } catch (error) {
    const { symbol: symbolParam } = await params;
    console.error(`Error fetching prices for ${symbolParam}:`, error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
}
