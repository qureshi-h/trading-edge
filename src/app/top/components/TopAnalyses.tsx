'use client';

import React from 'react';

import { Flex, Select } from 'antd';
import TabContent from './TabContent';
import DateTabs from '@/components/DateTabs';

import { CachedAnalyses, TopStock } from '@/types/stocks';
import { sectorOptions } from '@/utils/constants';
import { getDatesExcludingWeekends } from '@/utils/dates';

import '@/app/style.css';
import { Sector } from '@/types/general';

const { Option } = Select;

interface TopAnalysesProps {
    finalPage: boolean;
    defaultStockAnalyses: CachedAnalyses;
}

const TopAnalyses: React.FC<TopAnalysesProps> = ({ finalPage, defaultStockAnalyses }) => {
    const [sectorFilter, setSectorFilter] = React.useState<Sector>('All');
    const [cachedAnalyses, setCachedAnalyses] =
        React.useState<CachedAnalyses>(defaultStockAnalyses);

    const updateCachedAnalysis = (date: string, analysis: TopStock[] | null) => {
        setCachedAnalyses((prevState) => ({
            ...prevState,
            [date]: { [sectorFilter]: analysis },
        }));
    };

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
            <DateTabs
                dates={dates}
                renderContent={(date: string) => (
                    <TabContent
                        finalPage={finalPage}
                        date={date}
                        cachedData={cachedAnalyses}
                        updateCachedAnalysis={updateCachedAnalysis}
                        sectorFilter={sectorFilter}
                    />
                )}
                className="custom-tabs mx-3 sm:mx-2 py-3 px-5 flex-1"
            />
        </Flex>
    );
};

export default TopAnalyses;
