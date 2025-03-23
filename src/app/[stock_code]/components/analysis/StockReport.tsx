'use client';

import dayjs from 'dayjs';
import React, { Suspense } from 'react';
import Text from 'antd/es/typography/Text';
import { Tabs, Spin, Flex, Row } from 'antd';

import { StockAnalysis } from '@/types/stocks';
import { fetchStockAnalysis } from '@/utils/api/analysis';
import { getDatesExcludingWeekends } from '@/utils/dates';
import Panel1 from './Panels/Panel_1';
import Panel2 from './Panels/Panel_2';
import Panel3 from './Panels/Panel_3';

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
            className="-size !h-full items-stretch"
            align="top"
        >
            <Panel1 stockAnalysis={stockAnalysis} />
            <Panel2 stockAnalysis={stockAnalysis} />
            <Panel3 stockAnalysis={stockAnalysis} />
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

    const updateCachedAnalysis = (date: string, analysis: StockAnalysis | null) => {
        setCachedAnalyses((prevState) => ({
            ...prevState,
            [date]: analysis,
        }));
    };

    const tabItems = React.useMemo(
        () =>
            dates.map((date, index) => ({
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
            })),
        [dates, stockCode, cachedAnalyses],
    );

    return (
        <Flex vertical justify="center" className="mx-2 lg:mx-3">
            <Tabs
                defaultActiveKey="today"
                tabPosition="top"
                items={tabItems}
                className="custom-tabs mx-2 lg:mx-3"
                aria-label="Stock Report Tabs"
            />
        </Flex>
    );
};

export default StockReport;
