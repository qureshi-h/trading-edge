import React from 'react';

import { Flex } from 'antd';
import Title from 'antd/es/typography/Title';
import TopAnalyses from './components/TopAnalyses';
import PageContainer from '@/components/PageContainer';

import '@/app/style.css';

const Page = async () => {
    return (
        <PageContainer className="h-screen px-4 md:py-10 lg:py-0">
            <Flex
                vertical
                className="top-section h-fit w-full  sm:w-full md:w-5/6 lg:w-4/6 backdrop-blur-3xl rounded-3xl py-5 px-5"
            >
                <Title className="!text-white w-full !text-center">Top Picks</Title>
                <TopAnalyses />
            </Flex>
        </PageContainer>
    );
};

export default Page;
