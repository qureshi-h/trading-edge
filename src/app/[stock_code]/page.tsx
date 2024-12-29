import React from 'react';
import StockInfo from './components/StockInfo';
import { fetchStock } from '@/utils/stocks';
import StockAnalysis from './components/StockAnalysis';

const Page = async ({ params }: { params: Promise<{ stock_code: string }> }) => {
    const { stock_code } = await params;
    const stockInfo = await fetchStock(stock_code); // Fetch data here for SSR
    console.log(stockInfo);

    return (
        <div
            className="flex flex-col items-center justify-center h-screen px-4 md:py-10 lg:py-0 gap-5"
            style={{
                backgroundImage: `url('/image.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            }}
        >
            <StockInfo stockInfo={stockInfo} />
            <StockAnalysis />
        </div>
    );
};

export default Page;
