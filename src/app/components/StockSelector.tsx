'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {  Select, Typography } from 'antd';

import { Stock } from '@/types/stocks';

import '@/app/style.css';

const { Title } = Typography;
const { Option } = Select;

const StockSelector = ({ stocks }: { stocks: Stock[] }) => {
    const [stock, setStock] = useState<string | null>(null);
    const router = useRouter();

    const handleStockChange = (value: string) => {
        setStock(value);
    };

    const handleButtonClick = () => {
        if (stock) {
            router.push('/' + stock);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full p-5 gap-4">
            <Title level={2} className="!text-white">
                Select Stock
            </Title>
            <div className="flex flex-col sm:flex-row items-center w-full gap-3">
                <Select
                    showSearch
                    placeholder="Search by Stock Name or Code"
                    optionFilterProp="children"
                    onChange={handleStockChange}
                    size="large"
                    className="flex-1 w-full sm:w-auto"
                    value={stock}
                    aria-label="Stock Selector"
                >
                    {stocks.length > 0 ? (
                        stocks.map((stock) => (
                            <Option value={stock.stock_symbol} key={stock.stock_id}>
                                {stock.stock_symbol} - {stock.stock_name}
                            </Option>
                        ))
                    ) : (
                        <Option disabled>No stocks available</Option>
                    )}
                </Select>
                <button
                    disabled={!stock}
                    onClick={handleButtonClick}
                    aria-label="Go to Stock"
                    className="bg-blue-500 hover:bg-blue-700
                                 disabled:bg-gray-400 disabled:hover:bg-gray-400
                                  text-white font-bold py-2 px-4 rounded"
                >
                    Go
                </button>
            </div>
        </div>
    );
};

export default StockSelector;
