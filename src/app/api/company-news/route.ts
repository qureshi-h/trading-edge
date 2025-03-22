import { NextResponse } from 'next/server';

import { newsData } from '@/utils/testing/sampleData';

export async function GET(req: Request) {
    const url = new URL(req.url);
    const symbol = url.searchParams.get('symbol') || 'NVDA';
    const from = url.searchParams.get('from') || '2025-03-17';
    const to = url.searchParams.get('to') || '2025-03-18';

    const testingMode = process.env.NEXT_PUBLIC_NEWS_TESTING_MODE === 'true' || false;

    if (testingMode) {
        return new Promise<NextResponse>((resolve) => {
            setTimeout(() => {
                resolve(NextResponse.json(newsData));
            }, 500);
        });
    }

    try {
        const response = await fetch(
            `https://api.finnhub.io/api/v1/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${process.env.NEXT_PUBLIC_FINHUB_KEY}`,
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
    }
}
