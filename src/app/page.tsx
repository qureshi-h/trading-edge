import React from 'react';

import { Col, Flex, Row } from 'antd';
import StockSelector from './components/StockSelector';

import { Stock } from '@/types/stocks';
import { fetchStocks } from '@/utils/stocks';

const Page = async () => {
    const stocks: Stock[] = await fetchStocks();

    return (
        <Flex
            vertical
            align="center"
            justify="center"
            className="min-h-screen px-4 md:py-10 lg:py-0 gap-5 "
            style={{
                backgroundImage: `url('/image.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            }}
        >
            <Row className="w-full" justify="center">
                <Col xs={24} sm={24} md={12} lg={10}>
                    <StockSelector stocks={stocks} />
                </Col>
            </Row>
        </Flex>
    );
};

export default Page;
