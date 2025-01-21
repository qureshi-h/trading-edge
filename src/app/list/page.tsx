import React from 'react';

import { Flex } from 'antd';
import Title from 'antd/es/typography/Title';
import PageContainer from '@/components/PageContainer';

import { fetchStocksBySector } from '@/utils/api/stocks';
import { StockBySector } from '@/types/stocks';
import StockList from './components/StockList';

const Page = async () => {
    const stockList: StockBySector[] = await fetchStocksBySector();


    return (
        <PageContainer className="h-screen justify-start ">
            <Flex
                className="w-full h-full backdrop-blur-md !bg-slate-900/30 overflow-y-auto"
                justify="center"
            >
                <Flex
                    vertical
                    className="h-full w-full xs:w-full md:w-5/6 lg:w-4/6 py-5 px-5 mt-16"
                >
                    <Title className="!text-white w-full !text-center">Stocks List</Title>
                    <StockList stockList={stockList} />
                </Flex>
            </Flex>
        </PageContainer>
    );
};

export default Page;
