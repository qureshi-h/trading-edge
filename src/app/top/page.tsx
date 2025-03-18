import React, { Suspense } from 'react';

import { Flex, Spin } from 'antd';
import Title from 'antd/es/typography/Title';
import TopAnalyses from './components/TopAnalyses';
import PageContainer from '@/components/PageContainer';

import '@/styles/globals.css';

const Page = async () => {
    return (
        <PageContainer className="h-screen px-4 md:py-10 lg:py-0">
            <Suspense
                fallback={
                    <Flex className="w-full h-full" justify="center" align="center">
                        <Spin size="large" />
                    </Flex>
                }
            >
                <Flex
                    vertical
                    className="top-section h-fit w-full sm:w-full md:w-5/6 lg:w-4/6 backdrop-blur-3xl rounded-3xl py-5 px-5"
                    gap="1rem"
                >
                    <Title className="!text-white w-full !text-center">Top Picks</Title>
                    <TopAnalyses />
                </Flex>
            </Suspense>
        </PageContainer>
    );
};

export default Page;
