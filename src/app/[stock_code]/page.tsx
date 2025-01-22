import React from 'react';
import { Col } from 'antd';

import StockInfo from './components/StockInfo';
import StockReport from './components/StockReport';
import PageContainer from '@/components/PageContainer';

import { fetchStock } from '@/utils/api/stocks';
import { fetchStockAnalysis } from '@/utils/api/analysis';
import { Stock, StockAnalysis } from '@/types/stocks';
import { getDatesExcludingWeekends } from '@/utils/dates';

const getLastAnalysis = async (stock_code: string) => {
    for (const currentDate of getDatesExcludingWeekends(7)) {
        const stockAnalysis: StockAnalysis | null = await fetchStockAnalysis(
            stock_code,
            currentDate,
        );
        if (stockAnalysis !== null) {
            return { currentDate, stockAnalysis };
        }
    }
    return { currentDate: getDatesExcludingWeekends(1)[0], stockAnalysis: null };
};

const Page = async ({ params }: { params: Promise<{ stock_code: string }> }) => {
    const { stock_code } = await params;
    const stockInfo: Stock | null = await fetchStock(stock_code.toUpperCase());
    const { currentDate, stockAnalysis } = await getLastAnalysis(stock_code.toUpperCase());

    return (
        <PageContainer>
            <Col
                className="backdrop-blur-3xl rounded-xl p-5"
                span={12}
                xs={24}
                sm={24}
                md={16}
                lg={14}
                xl={10}
            >
                <StockInfo stockInfo={stockInfo} plotImage={stockAnalysis?.image ?? null} />
                <StockReport
                    stockCode={stock_code}
                    defaultStockAnalyses={{ [currentDate]: stockAnalysis }}
                />
            </Col>
        </PageContainer>
    );
};

export default Page;
