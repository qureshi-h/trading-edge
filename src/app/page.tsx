import React from 'react';

import Link from 'next/link';
import { Col, Flex, Row } from 'antd';
import Text from 'antd/es/typography/Text';
import StockSelector from './components/StockSelector';

import { Stock } from '@/types/stocks';
import { fetchStocks } from '@/utils/api/stocks';
import PageContainer from '@/components/PageContainer';

const Page = async () => {
    const stocks: Stock[] = await fetchStocks();

    return (
        <PageContainer>
            <Row className="w-full" justify="center" align={'middle'}>
                <Col xs={24} sm={24} md={12} lg={10}>
                    <Flex vertical align="center" justify="center" gap={10}>
                        <StockSelector stocks={stocks} />
                        <Text className="!text-lg">
                            <Link href="/top" className="!text-center bg-black">
                                Looking for Top Picks?
                            </Link>
                        </Text>
                    </Flex>
                </Col>
            </Row>
        </PageContainer>
    );
};

export default Page;
