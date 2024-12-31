import React from 'react';
import { Col, Flex } from 'antd';

import TopAnalyses from './components/TopAnalyses';
import PageContainer from '@/components/PageContainer';

import { StockAnalysis } from '@/types/stocks';
import { fetchTopAnalysis } from '@/utils/analysis';
import { getDatesExcludingWeekends } from '@/utils/dates';
import Title from 'antd/es/typography/Title';

import '@/app/style.css';

const Page = async () => {
    const currentDate = getDatesExcludingWeekends(1)[0];
    const stockAnalysis: StockAnalysis[] | null = await fetchTopAnalysis(currentDate, 0, 10);

    return (
        <PageContainer className="h-screen px-4 md:py-10 lg:py-0">
            {/* <Col
                className="rounded-sm p-2 my-5 overflow-y-scroll h-3/5"
                xs={24}
                sm={24}
                md={24}
                lg={24}
            > */}
            {/* w-full sm:w-full md:w-full lg:w-4/6 */}
            <Flex vertical className="h-3/4 w-full sm:w-full md:w-5/6 lg:w-4/6">
                <Title>Top Picks</Title>
                <TopAnalyses defaultStockAnalyses={{ [currentDate]: stockAnalysis }} />
            </Flex>
            {/* </Col> */}
        </PageContainer>
    );
};

export default Page;
