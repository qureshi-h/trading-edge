'use client';

import React, { Suspense } from 'react';
import { Tabs, Spin, Flex, Splitter, Typography, Row, Col } from 'antd';
import Text from 'antd/es/typography/Text';

import { StockAnalysis } from '@/types/stocks';
import { fetchStockAnalysis } from '@/utils/stocks';
import { getDatesExcludingWeekends } from '@/utils/dates';

import '@/app/style.css';

// Lazy load the content for each tab
const TabContent = ({
    stockCode,
    date,
    cachedData,
    updateCachedAnalysis,
}: {
    stockCode: string;
    date: string;
    cachedData: { [key: string]: StockAnalysis | null };
    updateCachedAnalysis: (date: string, analysis: StockAnalysis | null) => void;
}) => {
    const [stockAnalysis, setStockAnalysis] = React.useState<StockAnalysis | null>(
        cachedData[date] || null,
    );
    const [loading, setLoading] = React.useState<boolean>(cachedData[date] === undefined);

    React.useEffect(() => {
        console.log(cachedData);

        if (cachedData[date] === undefined) {
            const loadStockAnalysis = async () => {
                setLoading(true);
                const analysis = await fetchStockAnalysis(stockCode, date);
                setStockAnalysis(analysis);
                updateCachedAnalysis(date, analysis);
                setLoading(false);
            };

            loadStockAnalysis();
        }
    }, [stockCode, date, cachedData]);

    if (loading) {
        return (
            <Flex align="center">
                <Spin className="w-full" />
            </Flex>
        );
    }

    if (!stockAnalysis) {
        return (
            <Flex>
                <Text className="!text-gray-400 !text-center w-full">
                    No Analysis for {date} found!
                </Text>
            </Flex>
        );
    }

    return (
        <Row
            style={{ boxShadow: '0 0 10px rgba(194, 200, 209, 0.2)' }}
            className="stock-report !h-full items-stretch"
            align="top"
        >
            {/* Panel 1 */}
            <Col
                className="!p-5 text-base border-gray-500 border-2 flex-grow"
                xs={24}
                sm={24}
                md={12}
                lg={8}
            >
                <Flex vertical>
                    <Text>
                        <strong>Close Price: </strong>
                        {stockAnalysis.close_price}
                    </Text>
                    <Text>
                        <strong>Breakout Percentage: </strong>
                        {stockAnalysis.breakout_percentage}%
                    </Text>
                    <Text>
                        <strong>Consecutive Days Above Trendline: </strong>

                        {stockAnalysis.consecutive_days_above_trendline}
                    </Text>
                    <Text>
                        <strong>Trendline Accuracy: </strong>
                        {stockAnalysis.trendline_accuracy}%
                    </Text>
                </Flex>
            </Col>

            {/* Panel 2 */}
            <Col
                className="!p-5 text-base border-gray-500 border-2 flex-grow"
                xs={24}
                sm={24}
                md={12}
                lg={8}
            >
                <Flex vertical>
                    <Text>
                        <strong>RSI Value: </strong>
                        {stockAnalysis.rsi_value}
                    </Text>
                    <Text>
                        <strong>MACD Value: </strong>
                        {stockAnalysis.macd_value}
                    </Text>
                    <Text>
                        <strong>MACD Signal: </strong>
                        {stockAnalysis.macd_signal}
                    </Text>
                    <Text>
                        <strong>Upper Bollinger Band: </strong>
                        {stockAnalysis.upper_bollinger_band}
                    </Text>
                    <Text>
                        <strong>Middle Bollinger Band: </strong>
                        {stockAnalysis.middle_bollinger_band}
                    </Text>
                    <Text>
                        <strong>Lower Bollinger Band: </strong>
                        {stockAnalysis.lower_bollinger_band}
                    </Text>
                </Flex>
            </Col>

            {/* Panel 3 */}
            <Col
                className="!p-5 text-base border-gray-500 border-2 flex-grow"
                xs={24}
                sm={24}
                md={12}
                lg={8}
            >
                <Flex vertical>
                    <Text>
                        <strong>Volume: </strong>
                        {stockAnalysis.volume}
                    </Text>
                    <Text>
                        <strong>Volume Ratio: </strong>
                        {stockAnalysis.volume_ratio}
                    </Text>
                    <Text>
                        <strong>9 EMA: </strong>
                        {stockAnalysis.nine_ema}
                    </Text>
                    <Text>
                        <strong>12 EMA: </strong>
                        {stockAnalysis.twelve_ema}
                    </Text>
                    <Text>
                        <strong>21 EMA: </strong>
                        {stockAnalysis.twenty_one_ema}
                    </Text>
                </Flex>
            </Col>
        </Row>
    );
};

interface StockReportProps {
    defaultStockAnalyses: {
        [key: string]: StockAnalysis | null;
    };
    stockCode: string;
}

const StockReport = ({ defaultStockAnalyses, stockCode }: StockReportProps) => {
    const [cachedAnalyses, setCachedAnalyses] = React.useState<{
        [key: string]: StockAnalysis | null;
    }>(defaultStockAnalyses);
    const dates = getDatesExcludingWeekends(7);

    // Update the cached data if a new stock analysis is fetched
    const updateCachedAnalysis = (date: string, analysis: StockAnalysis | null) => {
        setCachedAnalyses((prevState) => ({
            ...prevState,
            [date]: analysis,
        }));
    };

    const tabItems = dates.map((date, index) => ({
        key: index === 0 ? 'today' : index.toString(),
        label: date,
        children: (
            <Suspense fallback={<Spin tip="Loading tab content..." />}>
                <TabContent
                    stockCode={stockCode}
                    date={index === 0 ? 'today' : date}
                    cachedData={cachedAnalyses}
                    updateCachedAnalysis={updateCachedAnalysis}
                />
            </Suspense>
        ),
    }));

    return (
        <Tabs defaultActiveKey="today" tabPosition="top" items={tabItems} className="custom-tabs" />
    );
};

export default StockReport;
