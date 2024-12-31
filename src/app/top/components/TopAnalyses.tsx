'use client';

import React from 'react';

import TabContent from './TabContent';
import DateTabs from '@/components/DateTabs';

import { TopStock } from '@/types/stocks';
import { getDatesExcludingWeekends } from '@/utils/dates';

import '@/app/style.css';

interface TopAnalysesProps {
    finalPage: boolean;
    defaultStockAnalyses: {
        [key: string]: TopStock[] | null;
    };
}

const TopAnalyses: React.FC<TopAnalysesProps> = ({ defaultStockAnalyses }) => {
    const [cachedAnalyses, setCachedAnalyses] = React.useState<{
        [key: string]: TopStock[] | null;
    }>(defaultStockAnalyses);

    const dates = getDatesExcludingWeekends(7);

    const updateCachedAnalysis = (date: string, analysis: TopStock[] | null) => {
        setCachedAnalyses((prevState) => ({
            ...prevState,
            [date]: analysis,
        }));
    };

    return (
        <DateTabs
            dates={dates}
            renderContent={(date: string) => (
                <TabContent
                    finalPage
                    date={date}
                    cachedData={cachedAnalyses}
                    updateCachedAnalysis={updateCachedAnalysis}
                />
            )}
            className="custom-tabs mx-3 sm:mx-2"
        />
    );
};

export default TopAnalyses;
