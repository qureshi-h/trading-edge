import React from 'react';
import Image from 'next/image';

import Title from 'antd/es/typography/Title';
import Text from 'antd/es/typography/Text';
import { Flex } from 'antd';

import { Stock } from '@/types/stocks';

interface StockInfoProps {
    stockInfo: Stock | null;
}

const StockInfo: React.FC<StockInfoProps> = ({ stockInfo }) => {
    return (
        <Flex vertical justify="center">
            {stockInfo ? (
                <Flex
                    vertical
                    className="p-5 rounded-md"
                    align="center"
                    justify="flex-start"
                >
                    <Title className="my-2 !text-4xl !sm:text-2xl !text-white">
                        {stockInfo.stock_name} ({stockInfo.stock_symbol})
                    </Title>
                    <Flex justify="space-between" align="center" className="!gap-10 sm:!gap-5">
                        <Image
                            src={`https://img.logo.dev/ticker/${stockInfo.stock_symbol}?token=${process.env.NEXT_PUBLIC_LOGO_PUBLIC_TOKEN}`}
                            alt={''}
                            width={100}
                            height={100}
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
                </Flex>
            ) : (
                <Text className="!text-xl !sm:text-2xl !text-white">
                    Stock information is unavailable.
                </Text>
            )}
        </Flex>
    );
};

export default StockInfo;
