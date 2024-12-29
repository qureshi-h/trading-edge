import React from 'react';
import StockInfo from './components/StockInfo';
import { fetchStock, fetchStockAnalysis } from '@/utils/stocks';
import StockReport from './components/StockReport';
import { Stock, StockAnalysis } from '@/types/stocks';
import { getDatesExcludingWeekends } from '@/utils/dates';
import { Col, Flex } from 'antd';

const Page = async ({ params }: { params: Promise<{ stock_code: string }> }) => {
    const { stock_code } = await params;
    const stockInfo: Stock | null = await fetchStock(stock_code);
    const currentDate = getDatesExcludingWeekends(1)[0];
    const stockAnalysis: StockAnalysis | null = await fetchStockAnalysis(stock_code, currentDate);

    return (
        <Flex
            vertical
            align="center"
            justify="center"
            className="min-h-screen px-4 md:py-10 lg:py-0 gap-5f"
            style={{
                backgroundImage: `url('/image.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            }}
        >
            <Col className="backdrop-blur-3xl" xs={24} sm={24} md={16} lg={16}>
                <StockInfo stockInfo={stockInfo} />
                <StockReport
                    stockCode={stock_code}
                    defaultStockAnalyses={{ today: stockAnalysis }}
                />
            </Col>
        </Flex>
    );
};

export default Page;
