'use client';

import React from 'react';

import TabContent from './TabContent';
import Text from 'antd/es/typography/Text';
import { Col, Flex, Row, Select, Slider, Tooltip } from 'antd';
import DateTabs from '@/components/DateTabs';

import { MAX_DAYS_ABOVE_TRENDLINE, sectorOptions } from '@/utils/constants';
import { getDatesExcludingWeekends } from '@/utils/dates';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InfoCircleOutlined } from '@ant-design/icons';
import { TopStockFilters } from '@/types/stocks';
import { useSearchParams } from 'next/navigation';
import { validateDaysAboveTrendline, validateSector } from '@/utils/validation';

const { Option } = Select;

const queryClient = new QueryClient();

const TopAnalyses = () => {
    const searchParams = useSearchParams();

    const [filters, setFilters] = React.useState<TopStockFilters>({
        sector: validateSector(searchParams.get('sector') as string),
        dat: validateDaysAboveTrendline(searchParams.get('dat') as string),
    });

    const [temporaryDat, setTemporaryDat] = React.useState<number | undefined>(filters.dat);

    const handleFiltersChange = <K extends keyof TopStockFilters>(
        name: K,
        value: TopStockFilters[K],
    ) => {
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));

        const params = new URLSearchParams(window.location.search);
        if (value === null || value === undefined) {
            params.delete(name);
        } else {
            params.set(name, String(value));
        }

        window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    };

    const dates = getDatesExcludingWeekends(7);

    return (
        <Flex vertical>
            <Row className="w-full px-4 lg:px-5" gutter={[24, 8]}>
                <Col xl={8} lg={10} md={12} sm={24} xs={24}>
                    <Flex className="w-full" justify="flex-start" align="center" gap="1rem">
                        <Text className="!w-fit">
                            <Tooltip
                                title={
                                    <Flex vertical>
                                        <Text>Days Above Trendline:</Text>
                                        <Text>Filter stocks {'<='} value</Text>
                                    </Flex>
                                }
                                className="mr-1"
                            >
                                <InfoCircleOutlined />{' '}
                            </Tooltip>
                            DAT: {temporaryDat !== MAX_DAYS_ABOVE_TRENDLINE ? temporaryDat : 'Max'}
                        </Text>
                        <Slider
                            min={1}
                            max={MAX_DAYS_ABOVE_TRENDLINE}
                            tooltip={{ open: false }}
                            value={temporaryDat}
                            onChange={(value) => setTemporaryDat(value)}
                            defaultValue={filters.dat}
                            onChangeComplete={(value) => handleFiltersChange('dat', value)}
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
