import { NextResponse } from 'next/server';
import { fetchAllPrices } from '@/lib/priceComparison';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const comparisons = await fetchAllPrices();

    return NextResponse.json({
      success: true,
      data: comparisons,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error fetching prices:', error);

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
