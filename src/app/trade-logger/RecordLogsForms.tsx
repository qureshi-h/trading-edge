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
    ConfigProvider,
    message,
} from 'antd';

import { Stock } from '@/types/stocks';
import './style.css';

const { Option } = Select;

interface RecordLogsFormsProps {
    stocks: Stock[];
}

type FieldType = {
    stock: string;
    trader: string;
    price: number;
    date: undefined;
    rationale: string;
    units: number;
};

const RecordLogsForms: React.FC<RecordLogsFormsProps> = ({ stocks }) => {
    const [form] = Form.useForm();

    const [messageApi, contextHolder] = message.useMessage();
    const [tradeType, setTradeType] = React.useState('buy');
    const [selectedStock, setSelectedStock] = React.useState<Stock | null>(null);

    const handleTabChange = (key: string) => {
        setTradeType(key);
    };

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        console.log('Success:', values);
        messageApi.open({
            type: 'success',
            content: 'Trade Logged Succesfully!',
        });
        form.resetFields();
        setSelectedStock(null);
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
        <Flex vertical className="w-full md:w-1/3" justify="center" align="center">
            {contextHolder}
            <Typography.Title
                style={{ color: 'white', textAlign: 'center' }}
                className="mb-2 text-xl sm:text-2xl"
            >
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
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="w-full bg-white p-4 sm:p-6 rounded-lg shadow-md"
                size="large"
            >
                <Form.Item
                    label="Stock"
                    name="stock"
                    rules={[{ required: true, message: 'Please select a stock!' }]}
                    style={{ marginBottom: 5 }}
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
                <Flex align="center" className="ml-2 my-0" justify="center">
                    <Flex gap="middle" style={{ opacity: selectedStock ? 1 : 0 }}>
                        <Typography.Text>
                            <strong>Sector:</strong> {selectedStock?.sector}
                        </Typography.Text>
                        <Typography.Text>
                            <strong>Exchange:</strong> {selectedStock?.exchange}
                        </Typography.Text>
                    </Flex>
                </Flex>

                {/* Trader Name */}
                <Form.Item
                    label="Trader Name"
                    name="trader"
                    rules={[{ required: true, message: 'Please select a trader!' }]}
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
                    rules={[{ required: true, message: `Please enter the ${tradeType} price!` }]}
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
                    rules={[{ required: true, message: `Please select the ${tradeType} date!` }]}
                >
                    <DatePicker className="w-full" />
                </Form.Item>

                {/* Units */}
                <Form.Item
                    label="Units"
                    name="units"
                    rules={[
                        { required: true, message: 'Please enter the number of units!' },
                        { type: 'integer', message: 'Units must be a valid integer!' },
                    ]}
                >
                    <InputNumber placeholder="Enter number of units" min={1} className="w-full" />
                </Form.Item>

                {/* Rationale */}
                <Form.Item
                    label="Rationale"
                    name="rationale"
                    rules={[{ required: true, message: 'Please enter a rationale!' }]}
                >
                    <Input placeholder="Enter rationale" className="w-full" />
                </Form.Item>

                {/* Submit Button */}
                <Form.Item className="text-center" label={null}>
                    <ConfigProvider wave={{ disabled: true }}>
                        <Button type="primary" htmlType="submit">
                            Submit Trade
                        </Button>
                    </ConfigProvider>
                </Form.Item>
            </Form>
        </Flex>
    );
};

export default RecordLogsForms;
