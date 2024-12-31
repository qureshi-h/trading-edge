import dayjs from 'dayjs';
import React from 'react';

import { Flex } from 'antd';
import { useRouter } from 'next/navigation';
import { Table, Spin, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { TopStock } from '@/types/stocks';
import { fetchTopAnalysis } from '@/utils/analysis';

const { Text } = Typography;

const TabContent = ({
    date,
    finalPage,
    cachedData,
    updateCachedAnalysis,
}: {
    date: string;
    finalPage: boolean;
    cachedData: { [key: string]: TopStock[] | null };
    updateCachedAnalysis: (date: string, analysis: TopStock[] | null) => void;
}) => {
    const router = useRouter();
    const [stockAnalysis, setStockAnalysis] = React.useState<TopStock[] | null>(
        cachedData[date] || null,
    );
    const [loading, setLoading] = React.useState<boolean>(cachedData[date] === undefined);
    const [loadMore, setLoadMore] = React.useState<boolean>(!finalPage);

    const [windowHeight, setWindowHeight] = React.useState<number>(0);

    console.log(loadMore);

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            setWindowHeight(window.innerHeight);

            const handleResize = () => {
                setWindowHeight(window.innerHeight);
            };

            window.addEventListener('resize', handleResize);
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, []);

    React.useEffect(() => {
        if (cachedData[date] === undefined) {
            const loadStockAnalysis = async () => {
                setLoading(true);
                const response = await fetchTopAnalysis(date, 1, 10);
                setStockAnalysis(response?.rows ?? []);
                updateCachedAnalysis(date, response?.rows ?? []);
                setLoadMore(!(response?.finalPage ?? true));
                setLoading(false);
            };

            loadStockAnalysis();
        }
    }, [date, cachedData, updateCachedAnalysis]);

    const handleLoadMore = async () => {
        if (stockAnalysis && loadMore) {
            fetchTopAnalysis(date, stockAnalysis?.length / 10 + 1, 10).then((response) => {
                if (response !== null) {
                    const newState = [...stockAnalysis, ...response.rows];
                    setStockAnalysis(newState);
                    updateCachedAnalysis(date, newState);
                    setLoadMore(!(response?.finalPage ?? true));
                }
            });
        }
    };

    if (loading) {
        return (
            <Flex align="center">
                <Spin className="w-full" />
            </Flex>
        );
    }

    if (!stockAnalysis || stockAnalysis.length === 0) {
        return (
            <Flex>
                <Text className="!p-5 text-base !text-gray-400 !text-center w-full">
                    No Analysis for {dayjs(date).format('DD MMMM')} found!
                </Text>
            </Flex>
        );
    }

    const columns: ColumnsType<TopStock> = [
        {
            title: 'Stock Symbol',
            dataIndex: 'stock_symbol',
            key: 'stock_symbol',
            fixed: 'left',
            render: (text) => (
                <Text
                    className="!text-black hover:!text-blue-600 cursor-pointer"
                    onClick={() => router.push('/' + text)}
                >
                    {text}
                </Text>
            ),
            sorter: (a: TopStock, b: TopStock) => a.stock_symbol.localeCompare(b.stock_symbol),
            filterMultiple: true,
            filters: stockAnalysis
                ? [...new Set(stockAnalysis.map((analysis) => analysis.stock_symbol))].map(
                      (symbol) => ({
                          text: symbol,
                          value: symbol,
                      }),
                  )
                : [],
            onFilter: (value, record) => record.stock_symbol.includes(value.toString()),
        },
        {
            title: 'Breakout %',
            dataIndex: 'breakout_percentage',
            key: 'breakout_percentage',
            render: (value) => `${value}%`,
            sorter: (a, b) => a.breakout_percentage - b.breakout_percentage,
        },
        {
            title: 'Close Price',
            dataIndex: 'close_price',
            key: 'close_price',
            sorter: (a, b) => a.close_price - b.close_price,
        },
        {
            title: 'Trendline Accuracy',
            dataIndex: 'trendline_accuracy',
            key: 'trendline_accuracy',
            render: (value) => `${value}%`,
            sorter: (a, b) => a.trendline_accuracy - b.trendline_accuracy,
        },
        {
            title: 'RSI',
            dataIndex: 'rsi_value',
            key: 'rsi_value',
            sorter: (a, b) => a.rsi_value - b.rsi_value,
        },
        {
            title: 'MACD',
            dataIndex: 'macd_value',
            key: 'macd_value',
            sorter: (a, b) => a.macd_value - b.macd_value,
        },
        {
            title: 'Volume',
            dataIndex: 'volume',
            key: 'volume',
            sorter: (a, b) => a.volume - b.volume,
        },
    ];

    return (
        <Table
            dataSource={stockAnalysis}
            columns={columns}
            pagination={false}
            scroll={{
                x: 1000,
                y: windowHeight > 910 ? 600 : 400,
            }}
            rowKey="analysis_id"
            virtual={true}
            className="w-full"
            footer={() => (
                <Flex
                    justify="right"
                    className={`${loadMore ? '!text-blue-400 cursor-pointer' : '!text-gray-500'} `}
                    onClick={handleLoadMore}
                >
                    <Text className="!text-inherit !text-right w-full cursor-pointer">
                        Load More
                    </Text>
                </Flex>
            )}
        />
    );
};

export default TabContent;
