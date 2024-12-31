import React from 'react';

import { Flex } from 'antd';
import Title from 'antd/es/typography/Title';
import TopAnalyses from './components/TopAnalyses';
import PageContainer from '@/components/PageContainer';

import { TopStock } from '@/types/stocks';
import { fetchTopAnalysis } from '@/utils/analysis';
import { getDatesExcludingWeekends } from '@/utils/dates';

import '@/app/style.css';

const Page = async () => {
    const currentDate = getDatesExcludingWeekends(1)[0];
    const stockAnalysis: TopStock[] | null = await fetchTopAnalysis(currentDate, 0, 10);

    return (
        <PageContainer className="h-screen px-4 md:py-10 lg:py-0">
            <Flex vertical className="h-3/4 w-full sm:w-full md:w-5/6 lg:w-4/6">
                <Title>Top Picks</Title>
                <TopAnalyses defaultStockAnalyses={{ [currentDate]: stockAnalysis }} />
            </Flex>
        </PageContainer>
    );
};

export default Page;
