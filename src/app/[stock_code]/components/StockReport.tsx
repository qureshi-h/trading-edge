'use client';

import dayjs from 'dayjs';
import React, { Suspense } from 'react';
import Text from 'antd/es/typography/Text';
import { Tabs, Spin, Flex, Row, Col } from 'antd';

import { StockAnalysis } from '@/types/stocks';
import { fetchStockAnalysis } from '@/utils/api/analysis';
import { getColorClassFromRange } from '@/utils/colour';
import { getDatesExcludingWeekends } from '@/utils/dates';

import '@/app/style.css';
import { analysisRanges } from '@/utils/constants';

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
    }, [stockCode, date, cachedData, updateCachedAnalysis]);

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
                <Text className="!p-5 text-base !text-gray-400 !text-center w-full">
                    No Analysis for {dayjs(date).format('DD MMMM')} found!
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
                    {stockAnalysis.breakout_percentage !== null ? (
                        <>
                            <Text>
                                <strong>Breakout Percentage: </strong>
                                <Text
                                    className={getColorClassFromRange(
                                        stockAnalysis.breakout_percentage,
                                        analysisRanges.breakout_percentage.low,
                                        analysisRanges.breakout_percentage.high,
                                    )}
                                >
                                    {stockAnalysis.breakout_percentage}%
                                </Text>
                            </Text>
                            <Text>
                                <strong>Consecutive Days Above Trendline: </strong>
                                <Text
                                    className={
                                        stockAnalysis.consecutive_days_above_trendline > 1
                                            ? getColorClassFromRange(
                                                  stockAnalysis.consecutive_days_above_trendline,
                                                  -1,
                                                  7,
                                              )
                                            : 'text-gray-500'
                                    }
                                >
                                    {stockAnalysis.consecutive_days_above_trendline}
                                </Text>
                            </Text>
                            <Text>
                                <strong>Trendline Accuracy: </strong>
                                <Text
                                    className={getColorClassFromRange(
                                        stockAnalysis.trendline_accuracy,
                                        0,
                                        100,
                                    )}
                                >
                                    {stockAnalysis.trendline_accuracy}%
                                </Text>
                            </Text>
                        </>
                    ) : (
                        <Text className="!my-2 !text-gray-400f">Breakout data unavailable</Text>
                    )}
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
                        <Text
                            className={getColorClassFromRange(
                                stockAnalysis.rsi_value,
                                0,
                                100,
                                true,
                            )}
                        >
                            {stockAnalysis.rsi_value}
                        </Text>
                    </Text>
                    <Text>
                        <strong>MACD Value: </strong>
                        <Text
                            className={getColorClassFromRange(stockAnalysis.macd_value, -100, 100)}
                        >
                            {stockAnalysis.macd_value}
                        </Text>
                    </Text>
                    <Text>
                        <strong>MACD Signal: </strong>
                        <Text
                            className={getColorClassFromRange(stockAnalysis.macd_signal, -100, 100)}
                        >
                            {stockAnalysis.macd_signal}
                        </Text>
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
                        <Text
                            className={getColorClassFromRange(
                                stockAnalysis.volume_ratio,
                                analysisRanges.volume_ratio.low,
                                analysisRanges.volume_ratio.high,
                            )}
                        >
                            {stockAnalysis.volume_ratio}
                        </Text>
                    </Text>
                    <Text>
                        <strong>9 EMA: </strong>
                        <Text
                            className={getColorClassFromRange(
                                stockAnalysis.nine_ema,
                                stockAnalysis.close_price * 0.8,
                                stockAnalysis.close_price * 1.2,
                            )}
                        >
                            {stockAnalysis.nine_ema}
                        </Text>
                    </Text>
                    <Text>
                        <strong>12 EMA: </strong>
                        <Text
                            className={getColorClassFromRange(
                                stockAnalysis.twelve_ema,
                                stockAnalysis.close_price * 0.8,
                                stockAnalysis.close_price * 1.2,
                            )}
                        >
                            {stockAnalysis.twelve_ema}
                        </Text>
                    </Text>
                    <Text>
                        <strong>21 EMA: </strong>
                        <Text
                            className={getColorClassFromRange(
                                stockAnalysis.twenty_one_ema,
                                stockAnalysis.close_price * 0.8,
                                stockAnalysis.close_price * 1.2,
                            )}
                        >
                            {stockAnalysis.twenty_one_ema}
                        </Text>
                    </Text>
                    <Text>
                        <strong>50 EMA: </strong>
                        <Text
                            className={getColorClassFromRange(
                                stockAnalysis.fifty_ema,
                                stockAnalysis.close_price * 0.8,
                                stockAnalysis.close_price * 1.2,
                            )}
                        >
                            {stockAnalysis.fifty_ema}
                        </Text>
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
        key: index.toString(),
        label: index === 0 ? 'Today' : dayjs(date).format('DD MMM'),
        children: (
            <Suspense fallback={<Spin tip="Loading..." />}>
                <TabContent
                    stockCode={stockCode}
                    date={date}
                    cachedData={cachedAnalyses}
                    updateCachedAnalysis={updateCachedAnalysis}
                />
            </Suspense>
        ),
    }));

    return (
        <Tabs
            defaultActiveKey="today"
            tabPosition="top"
            items={tabItems}
            className="custom-tabs mx-3 sm:mx-2"
        />
    );
};

export default StockReport;
