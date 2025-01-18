'use client';

import React from 'react';

import { Flex, Select } from 'antd';
import TabContent from './TabContent';
import DateTabs from '@/components/DateTabs';

import { sectorOptions } from '@/utils/constants';
import { getDatesExcludingWeekends } from '@/utils/dates';

import { Sector } from '@/types/general';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const { Option } = Select;

const queryClient = new QueryClient();

const TopAnalyses = () => {
    const [sectorFilter, setSectorFilter] = React.useState<Sector>('All');

    const handleSectorChange = async (value: Sector | null) => {
        if (value === null) {
            setSectorFilter('All');
        } else {
            setSectorFilter(value);
        }
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
                    {sectorOptions.slice(1).map((sector) => (
                        <Option key={sector} value={sector}>
                            {sector}
                        </Option>
                    ))}
                </Select>
            </Flex>
            <QueryClientProvider client={queryClient}>
                <DateTabs
                    dates={dates}
                    renderContent={(date: string) => (
                        <TabContent date={date} sectorFilter={sectorFilter} />
                    )}
                    className="custom-tabs mx-3 sm:mx-2 py-3 px-5 flex-1"
                />
            </QueryClientProvider>
        </Flex>
    );
};

export default TopAnalyses;
