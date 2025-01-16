import dayjs from 'dayjs';
import React from 'react';

import { Flex, Popover } from 'antd';
import { useRouter } from 'next/navigation';
import { Table, Spin, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { Sector } from '@/types/general';
import { analysisRanges } from '@/utils/constants';
import { fetchTopAnalysis } from '@/utils/api/analysis';
import { getColorClassFromRange } from '@/utils/colour';
import { CachedAnalyses, TopStock } from '@/types/stocks';

import '@/app/style.css';

const { Text } = Typography;

const PAGE_SIZE = 10;

const TabContent = ({
    date,
    sectorFilter,
    finalPage,
    cachedData,
    updateCachedAnalysis,
}: {
    date: string;
    sectorFilter: Sector;
    finalPage: boolean;
    cachedData: CachedAnalyses;
    updateCachedAnalysis: (date: string, analysis: TopStock[] | null) => void;
}) => {
    const router = useRouter();
    const [stockAnalysis, setStockAnalysis] = React.useState<TopStock[] | null>(
        cachedData[date] ? cachedData[date][sectorFilter] ?? null : null,
    );
    const [loading, setLoading] = React.useState<boolean>(
        cachedData[date] === undefined || cachedData[date][sectorFilter] === undefined,
    );
    const [loadMore, setLoadMore] = React.useState<boolean>(!finalPage);

    const [expandedRows, setExpandedRows] = React.useState<number[]>([]);
    const [windowHeight, setWindowHeight] = React.useState<number>(0);

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
        if (cachedData[date] === undefined || cachedData[date][sectorFilter] === undefined) {
            const loadStockAnalysis = async () => {
                setLoading(true);
                const response = await fetchTopAnalysis(date, 1, PAGE_SIZE, sectorFilter);
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
            fetchTopAnalysis(date, stockAnalysis?.length / PAGE_SIZE + 1, PAGE_SIZE, sectorFilter)
                .then((response) => {
                    if (response !== null) {
                        const newState = [...stockAnalysis, ...response.rows];
                        setStockAnalysis(newState);
                        updateCachedAnalysis(date, newState);
                        setLoadMore(!(response?.finalPage ?? true));
                    }
                })
                .catch((error) => console.error(error));
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
            title: 'Stock',
            dataIndex: 'stock_symbol',
            key: 'stock_symbol',
            fixed: 'left',
            render: (text: string, record: TopStock) => (
                <Flex gap={5}>
                    {expandedRows.includes(record.analysis_id) ? (
                        <Text
                            className="!text-orange-400 cursor-pointer px-3"
                            onClick={() =>
                                setExpandedRows((prev) =>
                                    prev.filter((id) => id !== record.analysis_id),
                                )
                            }
                        >
                            -
                        </Text>
                    ) : (
                        <Text
                            className="!text-orange-400 cursor-pointer px-3"
                            onClick={() => setExpandedRows((prev) => [...prev, record.analysis_id])}
                        >
                            +
                        </Text>
                    )}
                    <Popover
                        content={
                            <Flex>
                                <Text className="!text-gray-500">{record.stock_name}</Text>
                            </Flex>
                        }
                        trigger="hover"
                    >
                        <Text
                            className="!text-white hover:!text-blue-600 cursor-pointer"
                            onClick={() => router.push('/' + text)}
                        >
                            {text}
                        </Text>
                    </Popover>
                </Flex>
            ),
            sorter: (a: TopStock, b: TopStock) => a.stock_symbol.localeCompare(b.stock_symbol),
            filterMultiple: true,
            filters: stockAnalysis
                ? stockAnalysis.map((analysis) => ({
                      text: analysis.stock_symbol,
                      value: analysis.analysis_id,
                  }))
                : [],
            onFilter: (value, record) => value === record.analysis_id,
        },
        {
            title: 'Breakout %',
            dataIndex: 'breakout_percentage',
            key: 'breakout_percentage',

            render: (value) => (
                <Text
                    className={getColorClassFromRange(
                        value,
                        analysisRanges.breakout_percentage.low,
                        analysisRanges.breakout_percentage.high,
                    )}
                >
                    {value}%
                </Text>
            ),
            sorter: (a, b) => a.breakout_percentage - b.breakout_percentage,
        },
        {
            title: 'Close Price',
            dataIndex: 'close_price',
            key: 'close_price',
            sorter: (a, b) => a.close_price - b.close_price,
        },
        {
            title: 'Reliability',
            dataIndex: 'trendline_accuracy',
            key: 'trendline_accuracy',

            render: (value) => (
                <Text
                    className={getColorClassFromRange(
                        value,
                        analysisRanges.trendline_accuracy.low,
                        analysisRanges.trendline_accuracy.high,
                    )}
                >
                    {value}%
                </Text>
            ),
            sorter: (a, b) => a.trendline_accuracy - b.trendline_accuracy,
        },
        {
            title: 'RSI',
            dataIndex: 'rsi_value',
            key: 'rsi_value',
            sorter: (a, b) => a.rsi_value - b.rsi_value,
            render: (value) => (
                <Text
                    className={getColorClassFromRange(
                        value,
                        analysisRanges.rsi.low,
                        analysisRanges.rsi.high,
                        true,
                    )}
                >
                    {value}
                </Text>
            ),
        },
        {
            title: 'MACD',
            dataIndex: 'macd_value',
            key: 'macd_value',
            sorter: (a, b) => a.macd_value - b.macd_value,
            render: (value) => (
                <Text
                    className={getColorClassFromRange(
                        value,
                        analysisRanges.macd.low,
                        analysisRanges.macd.high,
                    )}
                >
                    {value}
                </Text>
            ),
        },
        {
            title: 'Volume Ratio',
            dataIndex: 'volume_ratio',
            key: 'volume',
            sorter: (a, b) => a.volume - b.volume,
            render: (value) => (
                <Text
                    className={getColorClassFromRange(
                        value,
                        analysisRanges.volume_ratio.low,
                        analysisRanges.volume_ratio.high,
                    )}
                >
                    {value}
                </Text>
            ),
        },
    ];

    return (
        <Table
            className="w-full"
            dataSource={stockAnalysis}
            columns={columns}
            expandable={{
                expandedRowRender: (record) => (
                    <Flex justify="center" className="bg-gray-950/20 p-5">
                        <Flex
                            justify="space-around"
                            wrap={true}
                            gap={10}
                            className="inherit-font-color !text-white w-full md:w-1/2 z-20 whitespace-nowrap "
                        >
                            <Flex>
                                <Text>
                                    <strong>Volume: </strong>
                                    {record.volume}
                                </Text>
                            </Flex>
                            <Flex>
                                <Text>
                                    <strong>9EMA: </strong>
                                    {record.nine_ema}
                                </Text>
                            </Flex>
                            <Flex>
                                <Text>
                                    <strong>12EMA: </strong>
                                    {record.twelve_ema}
                                </Text>
                            </Flex>
                            <Flex>
                                <Text>
                                    <strong>21EMA: </strong>
                                    {record.twenty_one_ema}
                                </Text>
                            </Flex>
                            <Flex>
                                <Text>
                                    <strong>50EMA: </strong>
                                    {record.fifty_ema}
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                ),
                expandIconColumnIndex: -1,
                expandedRowKeys: expandedRows,
                expandIcon: () => <></>,
            }}
            pagination={false}
            scroll={{
                x: 800,
                y: windowHeight > 910 ? 500 : 300,
            }}
            rowKey="analysis_id"
            virtual={true}
            footer={() => (
                <Flex
                    justify="space-between"
                    className={`${
                        loadMore ? '!text-blue-400 cursor-pointer' : '!text-gray-500 cursor-auto'
                    } `}
                    onClick={handleLoadMore}
                >
                    <Text className="!text-gray-200">Displaying {stockAnalysis.length} rows</Text>
                    <Text className="!text-inherit !text-right cursor-pointer">Load More</Text>
                </Flex>
            )}
        />
    );
};

export default TabContent;
