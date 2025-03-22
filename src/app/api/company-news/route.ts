import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const url = new URL(req.url);
    const symbol = url.searchParams.get('symbol') || 'NVDA';
    const from = url.searchParams.get('from') || '2025-03-17';
    const to = url.searchParams.get('to') || '2025-03-18';

    try {
        const response = await fetch(
            `https://api.finnhub.io/api/v1/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${process.env.NEXT_PUBLIC_FINHUB_KEY}`,
        );
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
    }
}
