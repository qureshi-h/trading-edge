'use client';

import dayjs from 'dayjs';
import React, { Suspense } from 'react';
import Text from 'antd/es/typography/Text';
import { Tabs, Spin, Flex, Row } from 'antd';

import Panel1 from './Panels/Panel_1';
import Panel2 from './Panels/Panel_2';
import Panel3 from './Panels/Panel_3';
import { AnimatedContainer } from '@/components/AnimatedContainer';

import { StockAnalysis } from '@/types/stocks';
import { AnimatePresence } from 'framer-motion';
import { fetchStockAnalysis } from '@/utils/api/analysis';
import { getDatesExcludingWeekends } from '@/utils/dates';

interface StockReportProps {
    defaultStockAnalyses: {
        [key: string]: StockAnalysis | null;
    };
    stockCode: string;
}

export default function StockReport({ defaultStockAnalyses, stockCode }: StockReportProps) {
    const dates = getDatesExcludingWeekends(7);
    const [activeTab, setActiveTab] = React.useState('0');
    const [loading, setLoading] = React.useState<boolean>(false);

    const [cachedAnalyses, setCachedAnalyses] =
        React.useState<Record<string, StockAnalysis | null>>(defaultStockAnalyses);
    const updateCachedAnalysis = React.useCallback(
        (date: string, analysis: StockAnalysis | null) => {
            setCachedAnalyses((prevState) => ({
                ...prevState,
                [date]: analysis,
            }));
        },
        [],
    );

    const tabItems = React.useMemo(
        () =>
            dates.map((date, index) => ({
                key: index.toString(),
                label: index === 0 ? 'Today' : dayjs(date).format('DD MMM'),
                content: (
                    <Suspense fallback={<Spin tip="Loading..." />}>
                        <TabContent
                            date={date}
                            stockCode={stockCode}
                            cachedData={cachedAnalyses}
                            setLoading={setLoading}
                            updateCachedAnalysis={updateCachedAnalysis}
                        />
                    </Suspense>
                ),
            })),
        [dates, stockCode, cachedAnalyses, updateCachedAnalysis],
    );

    return (
        <Flex vertical justify="center" className="mx-2 lg:mx-3">
            <Tabs
                defaultActiveKey="0"
                tabPosition="top"
                items={tabItems}
                activeKey={activeTab}
                onChange={setActiveTab}
                className="custom-tabs mx-2 lg:mx-3"
                aria-label="Stock Report Tabs"
            />
            <AnimatePresence mode="wait">
                {loading ? (
                    <AnimatedContainer key={'loading'}>
                        <Flex align="center" key="loading">
                            <Spin className="w-full" />
                        </Flex>
                    </AnimatedContainer>
                ) : (
                    tabItems.map(
                        (item) =>
                            activeTab === item.key && (
                                <AnimatedContainer key={item.key}>{item.content}</AnimatedContainer>
                            ),
                    )
                )}
            </AnimatePresence>
        </Flex>
    );
}

const TabContent = React.memo(
    ({
        date,
        stockCode,
        cachedData,
        setLoading,
        updateCachedAnalysis,
    }: {
        date: string;
        stockCode: string;
        cachedData: Record<string, StockAnalysis | null>;
        setLoading: React.Dispatch<React.SetStateAction<boolean>>;
        updateCachedAnalysis: (date: string, analysis: StockAnalysis | null) => void;
    }) => {
        const [stockAnalysis, setStockAnalysis] = React.useState<StockAnalysis | null>(
            cachedData[date] ?? null,
        );

        React.useEffect(() => {
            if (cachedData[date] === undefined) {
                const loadStockAnalysis = async () => {
                    setLoading(true);
                    await new Promise((resolve) => setTimeout(resolve, 1000));

                    const analysis = await fetchStockAnalysis(stockCode, date);
                    setStockAnalysis(analysis);
                    updateCachedAnalysis(date, analysis);
                    setLoading(false);
                };
                loadStockAnalysis();
            }
        }, [stockCode, date, cachedData, updateCachedAnalysis]);

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
                className="!h-full items-stretch"
                align="top"
            >
                <Panel1 stockAnalysis={stockAnalysis} />
                <Panel2 stockAnalysis={stockAnalysis} />
                <Panel3 stockAnalysis={stockAnalysis} />
            </Row>
        );
    },
);
