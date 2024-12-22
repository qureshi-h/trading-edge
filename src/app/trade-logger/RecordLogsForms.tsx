'use client';

import React from 'react';

import {
    Form,
    InputNumber,
    Select,
    DatePicker,
    Button,
    Tabs,
    TabsProps,
    Input,
    Flex,
    Typography,
    FormProps,
    // message,
} from 'antd';

import { Stock } from '@/types/stocks';
import './style.css';

const { Option } = Select;

interface RecordLogsFormsProps {
    stocks: Stock[];
}

type FieldType = {
    stock?: string;
    trader?: string;
    price?: number;
    date?: undefined;
    rationale?: string;
    units?: number;
};

const RecordLogsForms: React.FC<RecordLogsFormsProps> = ({ stocks }) => {
    // const [messageApi, contextHolder] = message.useMessage();
    const [tradeType, setTradeType] = React.useState('buy');
    const [selectedStock, setSelectedStock] = React.useState<Stock | null>(null);

    const handleTabChange = (key: string) => {
        setTradeType(key);
    };

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        console.log('Success:', values);
        // messageApi.open({
        //     type: 'success',
        //     content: 'Trade Logged Succesfully!',
        // });
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleStockChange = (stockId: number) => {
        const stock = stocks.find((s) => s.stock_id === stockId);
        setSelectedStock(stock || null);
    };

    const items: TabsProps['items'] = [
        {
            key: 'buy',
            label: 'Buy',
        },
        {
            key: 'sell',
            label: 'Sell',
        },
    ];

    return (
        <Flex vertical className="w-1/3" justify="center" align="center">
            {/* {contextHolder} */}
            <Typography.Title style={{ color: 'white', textAlign: 'center' }} className="mb-2">
                Trade Logger
            </Typography.Title>
            <Tabs
                defaultActiveKey="buy"
                items={items}
                onChange={handleTabChange}
                centered
                type="card"
                animated={{ inkBar: true, tabPane: true }}
                className="custom-tabs"
            />
            <Form
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                className="w-full bg-white p-6 rounded-lg shadow-md"
            >
                <Form.Item
                    label="Stock"
                    name="stock"
                    rules={[{ required: false, message: 'Please select a stock!' }]}
                >
                    <Select
                        showSearch
                        placeholder="Search by Stock Name or Code"
                        optionFilterProp="children"
                        onChange={handleStockChange}
                    >
                        {stocks.map((stock) => (
                            <Option value={stock.stock_id} key={stock.stock_id}>
                                {stock.stock_symbol} - {stock.stock_name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                {/* Displaying Stock Exchange */}
                <Flex align="center" className="mt-2 ml-2" justify="center">
                    {selectedStock && (
                        <Flex gap="middle">
                            <Typography.Text>
                                <strong>Sector:</strong> {selectedStock.sector}
                            </Typography.Text>
                            <Typography.Text>
                                <strong>Exchange:</strong> {selectedStock.exchange}
                            </Typography.Text>
                        </Flex>
                    )}
                </Flex>

                {/* Trader Name */}
                <Form.Item
                    label="Trader Name"
                    name="trader"
                    rules={[{ required: false, message: 'Please select a trader!' }]}
                >
                    <Select placeholder="Select Trader">
                        <Option value="Cyle">Cyle</Option>
                        <Option value="Hamza">Hamza</Option>
                        <Option value="Nick">Nick</Option>
                    </Select>
                </Form.Item>

                {/* Buy/Sale Price */}
                <Form.Item
                    label={` Price`}
                    name="price"
                    rules={[{ required: false, message: `Please enter the ${tradeType} price!` }]}
                >
                    <InputNumber
                        placeholder={`Enter ${tradeType} price`}
                        min={0}
                        className="w-full"
                    />
                </Form.Item>

                {/* Buy/Sale Date */}
                <Form.Item
                    label={` Date`}
                    name="date"
                    rules={[{ required: false, message: `Please select the ${tradeType} date!` }]}
                >
                    <DatePicker className="w-full" />
                </Form.Item>

                {/* Units */}
                <Form.Item
                    label="Units"
                    name="units"
                    rules={[
                        { required: false, message: 'Please enter the number of units!' },
                        { type: 'integer', message: 'Units must be a valid integer!' },
                    ]}
                >
                    <InputNumber placeholder="Enter number of units" min={1} className="w-full" />
                </Form.Item>

                {/* Rationale */}
                <Form.Item
                    label="Rationale"
                    name="rationale"
                    rules={[{ required: false, message: 'Please enter a rationale!' }]}
                >
                    <Input placeholder="Enter rationale" className="w-full" />
                </Form.Item>

                {/* Submit Button */}
                <Form.Item className="text-center" label={null}>
                    <Button type="primary" htmlType="submit">
                        Submit Trade
                    </Button>
                </Form.Item>
            </Form>
        </Flex>
    );
};

export default RecordLogsForms;
