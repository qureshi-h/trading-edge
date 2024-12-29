'use client';

import { GetStaticPaths, GetStaticProps } from 'next';
import { useState } from 'react';
import { Tabs, Table } from 'antd';

interface StockInfo {
    stock_name: string;
    stock_symbol: string;
    sector: string;
    exchange: string;
}

interface AnalysisData {
    analysis_date: string;
    analysis_period: string;
    close_price: number;
    breakout_percentage: number;
    consecutive_days_above_trendline: number;
    trendline_accuracy: number;
    rsi_value: number;
    macd_value: number;
    macd_signal: number;
    upper_bollinger_band: number;
    middle_bollinger_band: number;
    lower_bollinger_band: number;
    volume_ratio: number;
    created_at: string;
    volume: number;
    nine_ema: number;
    twelve_ema: number;
    twenty_one_ema: number;
    fifty_ema: number;
}

interface Props {
    stockInfo: StockInfo;
    analysisData: Record<string, AnalysisData[]>;
    availableDates: string[];
}

const StockPage = ({ stockInfo, analysisData, availableDates }: Props) => {
    const [activeDate, setActiveDate] = useState(availableDates[0]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">
                {stockInfo.stock_name} ({stockInfo.stock_symbol})
            </h1>
            <p>Sector: {stockInfo.sector}</p>
            <p>Exchange: {stockInfo.exchange}</p>

            <Tabs
                defaultActiveKey={availableDates[0]}
                onChange={(key) => setActiveDate(key)}
                className="my-4"
            >
                {availableDates.map((date) => (
                    <Tabs.TabPane tab={date} key={date} />
                ))}
            </Tabs>

            <h2 className="text-xl font-semibold mb-2">Analysis for {activeDate}</h2>
            <Table
                dataSource={analysisData[activeDate]}
                rowKey="analysis_date"
                bordered
                pagination={false}
                columns={[
                    { title: 'Analysis Date', dataIndex: 'analysis_date', key: 'analysis_date' },
                    {
                        title: 'Analysis Period',
                        dataIndex: 'analysis_period',
                        key: 'analysis_period',
                    },
                    { title: 'Close Price', dataIndex: 'close_price', key: 'close_price' },
                    {
                        title: 'Breakout %',
                        dataIndex: 'breakout_percentage',
                        key: 'breakout_percentage',
                    },
                    {
                        title: 'Days Above Trendline',
                        dataIndex: 'consecutive_days_above_trendline',
                        key: 'consecutive_days_above_trendline',
                    },
                    {
                        title: 'Trendline Accuracy',
                        dataIndex: 'trendline_accuracy',
                        key: 'trendline_accuracy',
                    },
                    { title: 'RSI', dataIndex: 'rsi_value', key: 'rsi_value' },
                    { title: 'MACD', dataIndex: 'macd_value', key: 'macd_value' },
                    { title: 'MACD Signal', dataIndex: 'macd_signal', key: 'macd_signal' },
                    { title: 'Volume Ratio', dataIndex: 'volume_ratio', key: 'volume_ratio' },
                    { title: 'Volume', dataIndex: 'volume', key: 'volume' },
                    { title: '9 EMA', dataIndex: 'nine_ema', key: 'nine_ema' },
                    { title: '12 EMA', dataIndex: 'twelve_ema', key: 'twelve_ema' },
                    { title: '21 EMA', dataIndex: 'twenty_one_ema', key: 'twenty_one_ema' },
                    { title: '50 EMA', dataIndex: 'fifty_ema', key: 'fifty_ema' },
                ]}
            />
        </div>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    const stocks = ['AAPL', 'GOOGL', 'MSFT']; // Example stock symbols; replace with your data source
    const paths = stocks.map((stock) => ({ params: { stock } }));
    return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (context) => {
    const stockSymbol = context.params?.stock as string;

    // Replace with actual API or database calls
    const stockInfo: StockInfo = {
        stock_name: 'Apple Inc.',
        stock_symbol: 'AAPL',
        sector: 'Technology',
        exchange: 'NASDAQ',
    };

    const analysisData: Record<string, AnalysisData[]> = {
        '2024-12-18': [
            {
                analysis_date: '2024-12-18',
                analysis_period: '1D',
                close_price: 175.2,
                breakout_percentage: 2.5,
                consecutive_days_above_trendline: 3,
                trendline_accuracy: 0.92,
                rsi_value: 58.3,
                macd_value: 1.23,
                macd_signal: 1.2,
                upper_bollinger_band: 180,
                middle_bollinger_band: 172,
                lower_bollinger_band: 164,
                volume_ratio: 1.5,
                created_at: '2024-12-18T12:00:00Z',
                volume: 1200000,
                nine_ema: 173.5,
                twelve_ema: 172.8,
                twenty_one_ema: 171.2,
                fifty_ema: 168.3,
            },
        ],
    };

    const availableDates = Object.keys(analysisData);

    return {
        props: {
            stockInfo,
            analysisData,
            availableDates,
        },
    };
};

export default StockPage;
