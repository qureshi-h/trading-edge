'use client';

import React from 'react';
import { Flex, Select, Slider } from 'antd';
import TabContent from './TabContent';
import DateTabs from '@/components/DateTabs';

import { sectorOptions } from '@/utils/constants';
import { getDatesExcludingWeekends } from '@/utils/dates';

import { Sector } from '@/types/general';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const { Option } = Select;

const queryClient = new QueryClient();

const TopAnalyses = () => {
    const [sectorFilter, setSectorFilter] = React.useState<Sector | null>(null);
    const [consecutiveDaysFilter, setConsecutiveDaysFilter] = React.useState<number>(3);

    const handleSectorChange = async (value: Sector | null) => {
        setSectorFilter(value);
    };

    const handleSliderChange = (value: number) => {
        setConsecutiveDaysFilter(value);
    };

    const dates = getDatesExcludingWeekends(7);

    return (
        <Flex vertical>
            <Flex className="w-full" justify="flex-end">
                <Select
                    allowClear
                    placeholder="Filter by Sector"
                    onChange={(value) => handleSectorChange(value || null)}
                    className="px-5 w-full sm:w-full xs:w-full md:w-1/2 lg:w-2/5 xl:w-1/4"
                    size={'large'}
                >
                    {sectorOptions.map((sector) => (
                        <Option key={sector} value={sector}>
                            {sector}
                        </Option>
                    ))}
                </Select>
                <Flex className="w-full" justify="flex-end" align="center">
                    <span>Max Consecutive Days Above Trendline: {consecutiveDaysFilter}</span>
                    <Slider
                        min={1}
                        max={10}
                        value={consecutiveDaysFilter}
                        onChange={handleSliderChange}
                        className="w-2/3 md:w-1/2 lg:w-1/4"
                    />
                </Flex>
            </Flex>

            <QueryClientProvider client={queryClient}>
                <DateTabs
                    dates={dates}
                    renderContent={(date: string) => (
                        <TabContent
                            date={date}
                            sectorFilter={sectorFilter}
                            // consecutiveDaysFilter={consecutiveDaysFilter}
                        />
                    )}
                    className="custom-tabs mx-3 sm:mx-2 py-3 px-5 flex-1"
                />
            </QueryClientProvider>
        </Flex>
    );
};

export default TopAnalyses;
