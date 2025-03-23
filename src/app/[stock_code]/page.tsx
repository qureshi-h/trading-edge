import React from 'react';

import { Col } from 'antd';

import PageContainer from '@/components/PageContainer';
import TabsContainer from './components/TabsContainer';

import { StockAnalysis } from '@/types/stocks';
import { fetchStock } from '@/utils/api/stocks';
import { fetchStockAnalysis } from '@/utils/api/analysis';
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
    const stockCodeUpper = stock_code.toUpperCase();

    try {
        const [stockInfo, { currentDate, stockAnalysis }] = await Promise.all([
            fetchStock(stockCodeUpper),
            getLastAnalysis(stockCodeUpper),
        ]);

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
                    <TabsContainer
                        currentDate={currentDate}
                        stockInfo={stockInfo}
                        stockAnalysis={stockAnalysis}
                        stockCode={stockCodeUpper}
                    />
                </Col>
            </PageContainer>
        );
    } catch (error) {
        console.error('Error fetching data:', error);
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
                    <p className="text-red-500">Failed to load data. Please try again later.</p>
                </Col>
            </PageContainer>
        );
    }
};

export default Page;
