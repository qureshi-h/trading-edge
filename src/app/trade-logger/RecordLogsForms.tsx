'use client';

import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
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
import { api } from '@/utils/api';

const { Option } = Select;

interface RecordLogsFormsProps {
    stocks: Stock[];
}

type FieldType = {
    stock: string;
    trader: string;
    price: number;
    date: Dayjs | undefined;
    rationale: string;
    units: number;
    option_type: string;
    strike_price: number;
    expiration_date: Dayjs | undefined;
};

const RecordLogsForms: React.FC<RecordLogsFormsProps> = ({ stocks }) => {
    const [form] = Form.useForm();

    const [messageApi, contextHolder] = message.useMessage();
    const [tradeType, setTradeType] = useState('Buy');
    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
    const [isOptions, setIsOptions] = useState(false);
    const [timeToExpire, setTimeToExpire] = useState<string | null>(null);
    const [tradeDate, setTradeDate] = useState<Dayjs | undefined>();

    // Function to calculate the "Time to Expire" based on trade date and expiration date
    const calculateTimeToExpire = () => {
        const tradeDate = form.getFieldValue('date');
        const expirationDate = form.getFieldValue('expiration_date');

        if (tradeDate && expirationDate) {
            const diffInDays = dayjs(expirationDate).diff(dayjs(tradeDate), 'days');
            setTimeToExpire(diffInDays >= 0 ? `${diffInDays} days` : 'Expired!');
        }
    };

    const handleFormValuesChange = (changedValues: Partial<FieldType>) => {
        // Only calculate time to expire if the relevant fields changed
        if (changedValues.date || changedValues.expiration_date) {
            calculateTimeToExpire();
        }
        if (changedValues.date) {
            setTradeDate(changedValues.date);
        }
    };

    const handleTabChange = (key: string) => {
        setTradeType(key);
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const tradePayload = {
            stock_id: values.stock,
            trader_name: values.trader,
            trade_type: tradeType.toLowerCase(),
            price: values.price,
            trade_date: values.date,
            units: values.units,
            rationale: values.rationale,
            option_type: values.option_type,
            strike_price: values.strike_price,
            expiration_date: values.expiration_date,
        };

        try {
            const response = await api.post('/api/trades', tradePayload);

            if (response.status === 201) {
                messageApi.open({
                    type: 'success',
                    content: 'Trade logged successfully!',
                });
                form.resetFields();
                setSelectedStock(null);
                setTimeToExpire(null);
            } else {
                throw new Error('Failed to log the trade');
            }
        } catch (error) {
            console.error('Error logging trade:', error);
            messageApi.open({
                type: 'error',
                content: 'An error occurred while logging the trade.',
            });
        }
    };

    const handleStockChange = (stockId: number) => {
        const stock = stocks.find((s) => s.stock_id === stockId);
        setSelectedStock(stock || null);
    };

    const items: TabsProps['items'] = [
        {
            key: 'Buy',
            label: 'Buy',
        },
        {
            key: 'Sell',
            label: 'Sell',
        },
    ];

    return (
        <Flex
            vertical
            className="w-full md:w-full lg:w-1/3  overflow-x-scroll"
            justify="center"
            align="center"
        >
            {contextHolder}
            <Typography.Title
                style={{ color: 'white', textAlign: 'center' }}
                className="mb-2 text-xl sm:text-2xl"
            >
                Trade Logger
            </Typography.Title>
            <Tabs
                defaultActiveKey="Buy"
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
                className="w-full bg-white p-4 sm:p-6 rounded-lg shadow-md  overflow-x-scroll"
                size="large"
                initialValues={{ tradeType: 'stock' }}
                onValuesChange={handleFormValuesChange}
            >
                {/* Select Stock or Options */}
                <Form.Item
                    label="Trade Type"
                    name="tradeType"
                    rules={[{ required: true, message: 'Please select a trade type!' }]}
                >
                    <Select onChange={(value) => setIsOptions(value === 'options')}>
                        <Option value="stock">Stock</Option>
                        <Option value="options">Options</Option>
                    </Select>
                </Form.Item>

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

                {/* Buy/Sale Price */}
                <Form.Item
                    label={`Price`}
                    name="price"
                    rules={[{ required: true, message: `Please enter the ${tradeType} price!` }]}
                >
                    <InputNumber
                        placeholder={`Enter ${tradeType} Price`}
                        min={0}
                        className="w-full"
                    />
                </Form.Item>

                {/* Buy/Sale Date */}
                <Form.Item
                    label={`Date`}
                    name="date"
                    rules={[{ required: true, message: `Please select the ${tradeType} date!` }]}
                >
                    <DatePicker className="w-full" placeholder={`Enter ${tradeType} Date`} />
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
                    <InputNumber placeholder="Enter Number of Units" min={1} className="w-full" />
                </Form.Item>

                {/* Option Fields (Only display if "Options" is selected) */}
                {isOptions && (
                    <>
                        <Form.Item
                            label="Option Type"
                            name="option_type"
                            rules={[{ required: true, message: 'Please select an option type!' }]}
                        >
                            <Select placeholder="Select Option Type">
                                <Option value="call">Call</Option>
                                <Option value="put">Put</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Strike Price"
                            name="strike_price"
                            rules={[{ required: true, message: 'Please enter the strike price!' }]}
                        >
                            <InputNumber
                                placeholder="Enter Strike Price"
                                min={0}
                                className="w-full"
                            />
                        </Form.Item>

                        {tradeType === 'Buy' && (
                            <Form.Item
                                label="Expiration Date"
                                name="expiration_date"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select the expiration date!',
                                    },
                                ]}
                                style={{ marginBottom: 5 }}
                            >
                                <DatePicker
                                    className="w-full"
                                    placeholder={`Enter Expiration Date`}
                                    minDate={tradeDate}
                                    disabled={!tradeDate}
                                />
                            </Form.Item>
                        )}

                        {/* Displaying Time to Expire */}
                        <Flex align="center" className="ml-2 my-0" justify="center">
                            <Flex gap="middle" style={{ opacity: timeToExpire ? 1 : 0 }}>
                                <Typography.Text>
                                    <strong>Time to Expire:</strong> {timeToExpire}
                                </Typography.Text>
                            </Flex>
                        </Flex>

                        {/* Rationale */}
                        <Form.Item
                            label="Rationale"
                            name="rationale"
                            rules={[{ required: true, message: 'Please enter a rationale!' }]}
                        >
                            <Input placeholder="Enter Rationale" className="w-full" />
                        </Form.Item>
                    </>
                )}

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
