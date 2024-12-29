import React from 'react';
import StockInfo from './components/StockInfo';
import { fetchStock, fetchStockAnalysis } from '@/utils/stocks';
import StockReport from './components/StockReport';
import { Stock, StockAnalysis } from '@/types/stocks';
import { getDatesExcludingWeekends } from '@/utils/dates';

const Page = async ({ params }: { params: Promise<{ stock_code: string }> }) => {
    const { stock_code } = await params;
    const stockInfo: Stock | null = await fetchStock(stock_code);
    const currentDate = getDatesExcludingWeekends(1)[0];
    const stockAnalysis: StockAnalysis | null = await fetchStockAnalysis(stock_code, currentDate);

    return (
        <div
            className="flex flex-col items-center justify-center h-screen px-4 md:py-10 lg:py-0 gap-5 text-base"
            style={{
                backgroundImage: `url('/image.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            }}
        >
            <StockInfo stockInfo={stockInfo} />
            <StockReport stockCode={stock_code} defaultStockAnalyses={{ today: stockAnalysis }} />
        </div>
    );
};

export default Page;
