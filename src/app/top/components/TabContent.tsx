import dayjs from 'dayjs';
import React from 'react';

import { Flex } from 'antd';
import { useRouter } from 'next/navigation';
import { Table, Spin, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { StockAnalysis } from '@/types/stocks';
import { fetchTopAnalysis } from '@/utils/analysis';

const { Text } = Typography;

const TabContent = ({
    date,
    cachedData,
    updateCachedAnalysis,
}: {
    date: string;
    cachedData: { [key: string]: StockAnalysis[] | null };
    updateCachedAnalysis: (date: string, analysis: StockAnalysis[] | null) => void;
}) => {
    const router = useRouter();
    const [stockAnalysis, setStockAnalysis] = React.useState<StockAnalysis[] | null>(
        cachedData[date] || null,
    );
    const [loading, setLoading] = React.useState<boolean>(cachedData[date] === undefined);

    React.useEffect(() => {
        if (cachedData[date] === undefined) {
            const loadStockAnalysis = async () => {
                setLoading(true);
                const analysis = await fetchTopAnalysis(date, 0, 10);
                setStockAnalysis(analysis);
                updateCachedAnalysis(date, analysis);
                setLoading(false);
            };

            loadStockAnalysis();
        }
    }, [date, cachedData, updateCachedAnalysis]);

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

    const columns: ColumnsType<StockAnalysis> = [
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
        },
        {
            title: 'Close Price',
            dataIndex: 'close_price',
            key: 'close_price',
        },
        {
            title: 'Breakout %',
            dataIndex: 'breakout_percentage',
            key: 'breakout_percentage',
            render: (value) => `${value}%`,
        },
        {
            title: 'Trendline Accuracy',
            dataIndex: 'trendline_accuracy',
            key: 'trendline_accuracy',
            render: (value) => `${value}%`,
        },
        {
            title: 'RSI',
            dataIndex: 'rsi_value',
            key: 'rsi_value',
        },
        {
            title: 'MACD',
            dataIndex: 'macd_value',
            key: 'macd_value',
        },
        {
            title: 'Volume',
            dataIndex: 'volume',
            key: 'volume',
        },
    ];

    return (
        <div>
            <Table
                dataSource={stockAnalysis}
                columns={columns}
                pagination={false}
                scroll={{ x: 1000, y: 400 }}
                rowKey="analysis_id"
                virtual={true}
                className="w-full"
            />
        </div>
    );
};

export default TabContent;
