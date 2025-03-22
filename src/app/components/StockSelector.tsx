'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import Link from 'next/link';
import { Button, Flex, Select } from 'antd';
import { ContainerFilled } from '@ant-design/icons';

import { Stock } from '@/types/stocks';

const { Option } = Select;

const StockSelector = ({ stocks }: { stocks: Stock[] }) => {
    const router = useRouter();

    const [stock, setStock] = useState<string | null>(null);
    const hasStocks = React.useMemo(() => stocks.length > 0, [stocks]);

    const handleStockChange = (value: string) => {
        setStock(value);
    };

    const handleButtonClick = () => {
        if (stock) {
            router.push('/' + stock);
        }
    };

    return (
        <Flex vertical gap={5} align="center" justify="center" className="w-full p-5 sm:px-3 pb-0">
            <Flex
                gap={5}
                align="center"
                justify="center"
                className="w-full xs:flex-row flex-wrap gap-3"
            >
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
                    {hasStocks ? (
                        stocks.map((stock) => (
                            <Option value={stock.stock_symbol} key={stock.stock_id}>
                                {stock.stock_symbol} - {stock.stock_name}
                            </Option>
                        ))
                    ) : (
                        <Option disabled>No stocks available</Option>
                    )}
                </Select>
                <Button
                    disabled={!stock}
                    onClick={handleButtonClick}
                    aria-label="Go to Stock"
                    color="blue"
                    variant="solid"
                >
                    Go
                </Button>
                <Button title="View All" aria-label="View All" color="volcano" variant="solid">
                    <Link href="/list" className="transparent-hover">
                        <ContainerFilled />
                    </Link>
                </Button>
            </Flex>
        </Flex>
    );
};

export default StockSelector;
