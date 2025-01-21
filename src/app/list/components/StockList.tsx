import { StockBySector } from '@/types/stocks';
import { Col, Flex, Row, Tooltip } from 'antd';
import Text from 'antd/es/typography/Text';
import Link from 'next/link';
import React from 'react';

const StockList = ({ stockList }: { stockList: StockBySector[] }) => {
    console.log(stockList);

    return (
        <Flex vertical justify="center" align="center">
            {stockList.map((sector, sectorIndex) => (
                <Flex
                    key={sector.sector + sectorIndex}
                    vertical
                    className="my-5 w-full"
                    justify="center"
                    align="center"
                >
                    <Text className="text-2xl py-3 !text-cyan-300 w-fit">{sector.sector}</Text>
                    <Row gutter={[0, 10]} className='w-full'>
                        {sector.stocks.map((stock) => (
                            <Col xs={6} sm={5} md={4} lg={3} >
                                <Flex className="justify-center">
                                    <Tooltip title={stock.stock_name}>
                                        <Link
                                            href={`/${stock.stock_symbol}`}
                                            className="text-white text-lg"
                                        >
                                            {stock.stock_symbol}
                                        </Link>
                                    </Tooltip>
                                </Flex>
                            </Col>
                        ))}
                    </Row>
                </Flex>
            ))}
        </Flex>
    );
};

export default StockList;
