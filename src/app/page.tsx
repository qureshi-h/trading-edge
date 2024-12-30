import React from 'react';

import { Col, Flex, Row } from 'antd';
import StockSelector from './components/StockSelector';

import { Stock } from '@/types/stocks';
import { fetchStocks } from '@/utils/stocks';
import PageContainer from '@/components/PageContainer';

const Page = async () => {
    const stocks: Stock[] = await fetchStocks();

    return (
        <PageContainer>
            <Row className="w-full" justify="center">
                <Col xs={24} sm={24} md={12} lg={10}>
                    <StockSelector stocks={stocks} />
                </Col>
            </Row>
        </PageContainer>
    );
};

export default Page;
