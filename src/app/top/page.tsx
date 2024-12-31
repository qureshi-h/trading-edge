import React from 'react';

import { Flex } from 'antd';
import Title from 'antd/es/typography/Title';
import TopAnalyses from './components/TopAnalyses';
import PageContainer from '@/components/PageContainer';

import { TopStock } from '@/types/stocks';
import { fetchTopAnalysis } from '@/utils/api/analysis';
import { getDatesExcludingWeekends } from '@/utils/dates';

import '@/app/style.css';

const Page = async () => {
    const currentDate = getDatesExcludingWeekends(1)[0];
    const stockAnalysis: { rows: TopStock[]; finalPage: boolean } | null = await fetchTopAnalysis(
        currentDate,
        1,
        10,
    );

    return (
        <PageContainer className="h-screen px-4 md:py-10 lg:py-0">
            <Flex vertical className="h-3/4 w-full sm:w-full md:w-5/6 lg:w-4/6">
                <Title className="!text-white w-full !text-center">Top Picks</Title>
                <TopAnalyses
                    finalPage={stockAnalysis?.finalPage ?? true}
                    defaultStockAnalyses={{ [currentDate]: stockAnalysis?.rows ?? null }}
                />
            </Flex>
        </PageContainer>
    );
};

export default Page;
