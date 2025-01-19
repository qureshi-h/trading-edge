'use client';

import React from 'react';

import TabContent from './TabContent';
import Text from 'antd/es/typography/Text';
import { Col, Flex, Row, Select, Slider, Tooltip } from 'antd';
import DateTabs from '@/components/DateTabs';

import { sectorOptions } from '@/utils/constants';
import { getDatesExcludingWeekends } from '@/utils/dates';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InfoCircleOutlined } from '@ant-design/icons';
import { TopStockFilters } from '@/types/stocks';

const { Option } = Select;

const queryClient = new QueryClient();

const TopAnalyses = () => {
    const [filters, setFilters] = React.useState<TopStockFilters>({
        sector: null,
        daysAboveTrendline: 5,
    });

    const handleFiltersChange = <K extends keyof TopStockFilters>(
        name: K,
        value: TopStockFilters[K],
    ) => {
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const dates = getDatesExcludingWeekends(7);

    return (
        <Flex vertical>
            <Row className="w-full px-4 lg:px-5" gutter={[24, 8]}>
                <Col xl={8} lg={10} md={12} sm={24} xs={24}>
                    <Flex className="w-full" justify="flex-start" align="center" gap="1rem">
                        <Text className="!w-fit">
                            <Tooltip title="Max Consecutive Days Above Trendline" className="mr-1">
                                <InfoCircleOutlined />{' '}
                            </Tooltip>
                            DAT:{' '}
                            {filters.daysAboveTrendline !== 5 ? filters.daysAboveTrendline : 'Max'}
                        </Text>
                        <Slider
                            min={1}
                            max={5}
                            tooltip={{ open: false }}
                            defaultValue={filters.daysAboveTrendline}
                            onChangeComplete={(value) =>
                                handleFiltersChange('daysAboveTrendline', value)
                            }
                            className="flex-1"
                        />
                    </Flex>
                </Col>
                <Col xl={8} lg={10} md={12} sm={24} xs={24}>
                    <Flex className="w-full" justify="flex-start" align="center">
                        <Select
                            allowClear
                            placeholder="Filter by Sector"
                            onChange={(value) => handleFiltersChange('sector', value || null)}
                            className="w-full"
                            value={filters.sector}
                        >
                            {sectorOptions.map((sector) => (
                                <Option key={sector} value={sector}>
                                    {sector}
                                </Option>
                            ))}
                        </Select>
                    </Flex>
                </Col>
            </Row>

            <QueryClientProvider client={queryClient}>
                <DateTabs
                    dates={dates}
                    renderContent={(date: string) => <TabContent date={date} filters={filters} />}
                    className="custom-tabs py-3 px-5 flex-1"
                />
            </QueryClientProvider>
        </Flex>
    );
};

export default TopAnalyses;
