'use client';

import React, { useState, useCallback } from 'react';

import Text from 'antd/es/typography/Text';
import { AnimatePresence } from 'framer-motion';
import { Tabs, Spin, notification, Flex } from 'antd';

import StockInfo from './analysis/StockInfo';
import NewsContainer from './news/Container';
import StockReport from './analysis/StockReport';
import { AnimatedContainer } from '@/components/AnimatedContainer';

import { NewsResponse } from '@/types/news';
import { getDateFormatted } from '@/utils/dates';
import { Stock, StockAnalysis } from '@/types/stocks';

interface TabsContainerProps {
    currentDate: string;
    stockInfo: Stock | null;
    stockAnalysis: StockAnalysis | null;
    stockCode: string;
}

const defaultTab = 'analysis';

const TabsContainer: React.FC<TabsContainerProps> = ({
    currentDate,
    stockInfo,
    stockAnalysis,
    stockCode,
}) => {
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [loading, setLoading] = useState<boolean>(false);
    const [newsData, setNewsData] = useState<NewsResponse[]>();

    const tabItems = [
        {
            label: 'Analysis',
            key: 'analysis',
            content: (
                <React.Fragment>
                    {' '}
                    <StockInfo stockInfo={stockInfo} plotImage={stockAnalysis?.image ?? null} />
                    <StockReport
                        stockCode={stockCode}
                        defaultStockAnalyses={{ [currentDate]: stockAnalysis }}
                    />
                </React.Fragment>
            ),
        },
        {
            label: 'News',
            key: 'news',
            content: <NewsContainer stockCode={stockCode} newsData={newsData ?? []} />,
        },
    ];

    const fetchNewsData = async (stockCode: string) => {
        setLoading(true);
        try {
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);

            const to = getDateFormatted(today);
            const from = getDateFormatted(yesterday);

            const res = await fetch(`/api/company-news?symbol=${stockCode}&from=${from}&to=${to}`);
            const data = await res.json();

            if ('error' in data) throw new Error(data.error);

            setNewsData(data as NewsResponse[]);
        } catch (error) {
            console.error(error);
            notification.error({ message: `Error fetching news for ${stockCode}` });
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = useCallback(
        async (activeKey: string) => {
            if (activeKey === 'news' && newsData === undefined) {
                await fetchNewsData(stockCode);
                setActiveTab(activeKey);
            } else {
                setActiveTab(activeKey);
            }
        },
        [newsData, stockCode],
    );

    return (
        <React.Fragment>
            <Tabs
                defaultActiveKey={defaultTab}
                activeKey={activeTab}
                items={tabItems}
                onChange={handleTabChange}
                tabPosition="top"
                className="custom-tabs"
                type="line"
                centered
                aria-label="Stock Tabs"
            />

            <AnimatePresence mode="wait">
                {loading ? (
                    <AnimatedContainer key="loading">
                        <Flex vertical className="p-5" align="center" justify="center" gap="1rem">
                            <Spin aria-label="Loading" className="w-full" />
                            <Text className="">Fetching Latest News...</Text>
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
        </React.Fragment>
    );
};

export default TabsContainer;
