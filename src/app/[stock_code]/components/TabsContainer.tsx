'use client';

import React, { useState, useRef, useCallback, useLayoutEffect } from 'react';

import Text from 'antd/es/typography/Text';
import { Tabs, Flex, notification, Spin } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';

import StockInfo from './analysis/StockInfo';
import StockReport from './analysis/StockReport';
import NewsContainer from './news/Container';

import { Stock, StockAnalysis } from '@/types/stocks';
import { NewsResponse } from '@/types/news';
import { getDateFormatted } from '@/utils/dates';

interface TabsContainerProps {
    currentDate: string;
    stockInfo: Stock | null;
    stockAnalysis: StockAnalysis | null;
    stockCode: string;
}

const defaultTab = 'analysis';
const tabItems = [
    { label: 'Analysis', key: 'analysis' },
    { label: 'News', key: 'news' },
];

const TabsContainer: React.FC<TabsContainerProps> = ({
    currentDate,
    stockInfo,
    stockAnalysis,
    stockCode,
}) => {
    const contentRef = useRef<HTMLDivElement>(null);

    const [activeTab, setActiveTab] = useState(defaultTab);
    const [loading, setLoading] = useState<boolean>(false);
    const [newsData, setNewsData] = useState<NewsResponse[]>();
    const [contentHeight, setContentHeight] = useState<number | 'auto'>('auto');

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

    const measureHeight = () => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        }
    };

    useLayoutEffect(() => {
        const timeout = setTimeout(() => {
            measureHeight();
        }, 10);

        return () => clearTimeout(timeout);
    }, [activeTab, loading]);

    const handleTabChange = useCallback(
        async (activeKey: string) => {
            if (activeKey === 'news' && !newsData) {
                await fetchNewsData(stockCode);
                measureHeight();
            }
            setActiveTab(activeKey);
        },
        [newsData, stockCode],
    );

    return (
        <>
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

            <motion.div
                animate={{ height: contentHeight }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="overflow-hidden"
            >
                <AnimatePresence mode="sync">
                    <motion.div
                        key={activeTab}
                        ref={contentRef}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{
                            opacity: 0,
                            transition: { duration: 0.5 },
                        }}
                        transition={{ duration: 0.5 }}
                    >
                        {loading ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5, ease: 'anticipate' }}
                            >
                                <Flex
                                    vertical
                                    justify="center"
                                    align="center"
                                    gap="0.5rem"
                                    className="mb-1 h-fit w-full"
                                >
                                    <Spin aria-label="Loading" className="w-full" />
                                    <Text className="!text-white">Fetching Latest News...</Text>
                                </Flex>
                            </motion.div>
                        ) : activeTab === 'analysis' ? (
                            <React.Fragment>
                                <StockInfo
                                    stockInfo={stockInfo}
                                    plotImage={stockAnalysis?.image ?? null}
                                />
                                <StockReport
                                    stockCode={stockCode}
                                    defaultStockAnalyses={{ [currentDate]: stockAnalysis }}
                                />
                            </React.Fragment>
                        ) : (
                            <NewsContainer stockCode={stockCode} newsData={newsData ?? []} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </>
    );
};

export default TabsContainer;
