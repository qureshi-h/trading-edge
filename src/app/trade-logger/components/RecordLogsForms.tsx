'use client';

import React, { useReducer, useState } from 'react';
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

import { HeldStock, Stock } from '@/types/stocks';
import { api } from '@/utils/api';
import './style.css';
import { initialState, reducer } from '../reducer';

const { Option } = Select;

interface RecordLogsFormsProps {
    stocks: Stock[];
}

type FieldType = {
    stock: number;
    trader: string;
    trade_type: string;
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
    const [tab, setTab] = useState('Buy');
    const [state, dispatch] = useReducer(reducer, initialState);

    // Function to calculate the "Time to Expire" based on trade date and expiration date
    const calculateTimeToExpire = () => {
        const tradeDate = form.getFieldValue('date');
        const expirationDate = form.getFieldValue('expiration_date');

        if (tradeDate && expirationDate) {
            const diffInDays = dayjs(expirationDate).diff(dayjs(tradeDate), 'days');
            dispatch({
                type: 'SET_TIME_TO_EXPIRE',
                payload: diffInDays >= 0 ? `${diffInDays} days` : 'Expired!',
            });
        }
    };

    const getCurrentlyHeldStocks = async () => {
        const trader = form.getFieldValue('trader');
        const tradeType = form.getFieldValue('trade_type');

        if (trader && tradeType) {
            const response = await api
                .get<{ holdings: HeldStock[]; message?: string }>(
                    '/api/trades/holdings/' + trader,
                    {
                        trade_type: tradeType.toLowerCase(),
                    },
                )
                .then((response) => {
                    if (response.status === 200) return response.data.holdings;
                    else if (response.status === 404) return [] as HeldStock[];
                    else throw new Error(response.data.message);
                })
                .catch((err) => {
                    console.error(err);
                    return [] as HeldStock[];
                });
            if (
                !state.selectedStock ||
                !response.find((stock) => state.selectedStock?.stock_id === stock.stock_id)
            ) {
                form.setFieldValue('stock', undefined);
                form.setFieldValue('units', undefined);
                dispatch({ type: 'SET_SELECTED_STOCK', payload: null });
            }
            dispatch({ type: 'SET_CURRENTLY_HELD_STOCKS', payload: response });
        }
    };

    const handleFormValuesChange = (changedValues: Partial<FieldType>) => {
        if (changedValues.date || changedValues.expiration_date) {
            calculateTimeToExpire();
        }
        if (changedValues.date) {
            dispatch({ type: 'SET_TRADE_DATE', payload: changedValues.date });
        }
        if (tab === 'Sell' && (changedValues.trader || changedValues.trade_type)) {
            getCurrentlyHeldStocks();
        }
        if (tab === 'Sell' && changedValues.stock) {
            const stockData = state.currentlyHeldStocks?.find(
                (stock) => stock.stock_id === changedValues.stock,
            );

            const units = stockData?.net_units || 0;
            dispatch({ type: 'SET_NET_UNITS', payload: units });
            form.setFieldValue('units', units);
        }
    };

    const handleTabChange = (key: string) => {
        if (key === 'Sell') getCurrentlyHeldStocks();
        setTab(key);
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const tradePayload = {
            stock_id: values.stock,
            trader_name: values.trader,
            trade_type: tab.toLowerCase(),
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
                resetForm();
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

    const resetForm = () => {
        form.resetFields();
        dispatch({ type: 'RESET' });
    };

    const handleStockChange = (stockId: number) => {
        const stock = stocks.find((s) => s.stock_id === stockId);
        dispatch({ type: 'SET_SELECTED_STOCK', payload: stock || null });
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
                initialValues={{ trade_type: 'stock' }}
                onValuesChange={handleFormValuesChange}
            >
                {/* Select Stock or Options */}
                <Form.Item
                    label="Trade Type"
                    name="trade_type"
                    rules={[{ required: true, message: 'Please select a trade type!' }]}
                >
                    <Select
                        onChange={(value) =>
                            dispatch({ type: 'SET_IS_OPTIONS', payload: value === 'options' })
                        }
                    >
                        <Option value="stock">Stock</Option>
                        <Option value="options">Option</Option>
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
                        {tab === 'Sell'
                            ? state.currentlyHeldStocks?.map((stock) => (
                                  <Option value={stock.stock_id} key={stock.stock_id}>
                                      {stock.stock_symbol} - {stock.stock_name}
                                  </Option>
                              ))
                            : stocks.map((stock) => (
                                  <Option value={stock.stock_id} key={stock.stock_id}>
                                      {stock.stock_symbol} - {stock.stock_name}
                                  </Option>
                              ))}
                    </Select>
                </Form.Item>

                {/* Displaying Stock Exchange */}
                <Flex align="center" className="ml-2 my-0" justify="center">
                    <Flex gap="middle" style={{ opacity: state.selectedStock ? 1 : 0 }}>
                        <Typography.Text>
                            <strong>Sector:</strong> {state.selectedStock?.sector}
                        </Typography.Text>
                        <Typography.Text>
                            <strong>Exchange:</strong> {state.selectedStock?.exchange}
                        </Typography.Text>
                    </Flex>
                </Flex>

                {/* Buy/Sale Price */}
                <Form.Item
                    label={`Price`}
                    name="price"
                    rules={[{ required: true, message: `Please enter the ${tab} price!` }]}
                >
                    <InputNumber
                        placeholder={`Enter ${tab} Price`}
                        min={0}
                        className="w-full"
                        prefix="$"
                    />
                </Form.Item>

                {/* Buy/Sale Date */}
                <Form.Item
                    label={`Date`}
                    name="date"
                    rules={[{ required: true, message: `Please select the ${tab} date!` }]}
                >
                    <DatePicker className="w-full" placeholder={`Enter ${tab} Date`} />
                </Form.Item>

                {/* Option Fields (Only display if "Options" is selected) */}
                {state.isOptions && (
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
                                prefix="$"
                                precision={2}
                            />
                        </Form.Item>

                        {tab === 'Buy' && (
                            <>
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
                                        minDate={state.tradeDate}
                                        disabled={!state.tradeDate}
                                    />
                                </Form.Item>

                                {/* Displaying Time to Expire */}
                                <Flex align="center" className="ml-2 my-0" justify="center">
                                    <Flex
                                        gap="middle"
                                        style={{ opacity: state.timeToExpire ? 1 : 0 }}
                                    >
                                        <Typography.Text>
                                            <strong>Time to Expire:</strong> {state.timeToExpire}
                                        </Typography.Text>
                                    </Flex>
                                </Flex>
                            </>
                        )}
                    </>
                )}

                {/* Units */}
                <Form.Item
                    label={`${state.isOptions ? 'Contracts' : 'Units'}`}
                    name="units"
                    rules={[
                        {
                            required: true,
                            message: `Please enter the number of ${
                                state.isOptions ? 'contracts' : 'inits'
                            }!`,
                        },
                        { type: 'integer', message: 'Units must be a valid integer!' },
                    ]}
                >
                    <InputNumber
                        placeholder={`Enter Number of ${state.isOptions ? 'Contracts' : 'Units'}`}
                        min={1}
                        className="w-full"
                        max={state.netUnits}
                    />
                </Form.Item>

                {/* Rationale */}
                <Form.Item
                    label="Rationale"
                    name="rationale"
                    rules={[{ required: true, message: 'Please enter a rationale!' }]}
                >
                    <Input placeholder="Enter Rationale" className="w-full" />
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
