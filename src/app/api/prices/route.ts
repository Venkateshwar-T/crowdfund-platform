
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.COINGECKO_API_KEY || '';
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,inr',
      {
        headers: {
          'x-cg-demo-api-key': apiKey,
        },
      }
    );
    
    if (!res.ok) {
      throw new Error('Failed to fetch from CoinGecko');
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
