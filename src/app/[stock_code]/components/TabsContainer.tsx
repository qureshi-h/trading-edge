'use client';

import React, { useState, useRef, useCallback, useLayoutEffect } from 'react';

import Text from 'antd/es/typography/Text';
import { Tabs, Spin, notification, Flex } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';

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

const animationDuration = 0.5;
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

    const resize = useCallback(
        (delay = 50) =>
            setTimeout(() => {
                if (contentRef.current) {
                    setContentHeight(contentRef.current.scrollHeight);
                }
            }, delay),
        [],
    );

    useLayoutEffect(() => {
        const timeout = resize();

        return () => clearTimeout(timeout);
    }, [activeTab, loading, resize]);

    const handleTabChange = useCallback(
        async (activeKey: string) => {
            if (activeKey === 'news' && newsData === undefined) {
                await fetchNewsData(stockCode);
                setActiveTab(activeKey);
            } else {
                setContentHeight(0);
                setTimeout(() => {
                    setActiveTab(activeKey);
                }, animationDuration * 1100);
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

            <motion.div
                animate={{ height: contentHeight }}
                initial={{ height: 0 }}
                transition={{ duration: animationDuration, ease: 'easeInOut' }}
                exit={{ height: 0 }}
                layout
                className="overflow-hidden"
            >
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            ref={contentRef}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: animationDuration, delay: animationDuration }}
                        >
                            <Flex
                                vertical
                                className="p-5"
                                align="center"
                                justify="center"
                                gap="1rem"
                            >
                                <Spin aria-label="Loading" className="w-full" />
                                <Text className="">Fetching Latest News...</Text>
                            </Flex>
                        </motion.div>
                    ) : activeTab === 'analysis' ? (
                        <motion.div
                            key="analysis"
                            ref={contentRef}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: animationDuration }}
                        >
                            <StockInfo
                                stockInfo={stockInfo}
                                plotImage={stockAnalysis?.image ?? null}
                            />
                            <StockReport
                                stockCode={stockCode}
                                defaultStockAnalyses={{ [currentDate]: stockAnalysis }}
                            />
                        </motion.div>
                    ) : (
                        activeTab === 'news' && (
                            <motion.div
                                key="news"
                                ref={contentRef}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: animationDuration }}
                            >
                                <NewsContainer
                                    stockCode={stockCode}
                                    newsData={newsData ?? []}
                                    resize={resize}
                                />
                            </motion.div>
                        )
                    )}
                </AnimatePresence>
            </motion.div>
        </React.Fragment>
    );
};

export default TabsContainer;
