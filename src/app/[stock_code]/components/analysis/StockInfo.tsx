import React from 'react';

import Text from 'antd/es/typography/Text';
import Title from 'antd/es/typography/Title';
import { Col, Flex, Image, Row } from 'antd';

import { Stock } from '@/types/stocks';
import { API_URL } from '@/utils/api/api';

interface StockInfoProps {
    stockInfo: Stock | null;
    plotImage: string | null;
}

const StockInfo: React.FC<StockInfoProps> = ({ stockInfo, plotImage }) => {
    return (
        <Flex vertical justify="center" className="mx-2 lg:mx-3">
            {stockInfo ? (
                <Row align="middle">
                    <Col
                        className="p-5 rounded-md flex flex-col justify-start"
                        sm={24}
                        md={16}
                        lg={16}
                        xl={16}
                    >
                        <Title className="my-2 !text-4xl !sm:text-2xl !text-white md:!text-center">
                            {stockInfo.stock_name} ({stockInfo.stock_symbol})
                        </Title>
                        <Flex justify="space-evenly" align="center" className="!gap-10 sm:!gap-5">
                            <Image
                                src={`https://img.logo.dev/ticker/${stockInfo.stock_symbol}?token=${process.env.NEXT_PUBLIC_LOGO_PUBLIC_TOKEN}`}
                                alt={''}
                                width={100}
                                height={100}
                                fallback="/images/fallback-company-icon.png"
                            />
                            <Flex vertical>
                                <Text className="mb-1 !text-xl !sm:text-2xl !text-white !text-right">
                                    Sector: {stockInfo.sector}
                                </Text>
                                <Text className="mb-1 !text-xl !sm:text-2xl !text-white !text-right">
                                    Exchange: {stockInfo.exchange}
                                </Text>
                            </Flex>
                        </Flex>
                    </Col>
                    <Col
                        sm={{ span: 12, offset: 6 }}
                        lg={{ span: 8, offset: 0 }}
                        md={{ span: 8, offset: 0 }}
                        xl={{ span: 8, offset: 0 }}
                    >
                        {plotImage !== null && (
                            <Image
                                src={`${API_URL}/plot/${plotImage}`}
                                alt={'Plot Not Found!'}
                                width={'100%'}
                                className="p-5 backdrop-blur-3xl rounded-xl bg-black/30"
                                preview={{
                                    className: 'p-5 backdrop-blur-3xl bg-black/30',
                                }}
                            />
                        )}
                    </Col>
                </Row>
            ) : (
                <Text className="!text-xl !sm:text-2xl !text-white">
                    Stock information is unavailable.
                </Text>
            )}
        </Flex>
    );
};

export default StockInfo;
