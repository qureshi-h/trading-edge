import React from 'react';

import { Flex, Col } from 'antd';
import Text from 'antd/es/typography/Text';

import { StockAnalysis } from '@/types/stocks';
import { getColorClassFromRange } from '@/utils/colour';

const Panel2 = ({ stockAnalysis }: { stockAnalysis: StockAnalysis }) => (
    <Col
        className="!p-5 text-base border-gray-500 border-2 flex-grow"
        xs={24}
        sm={24}
        md={12}
        lg={8}
    >
        <Flex vertical>
            <Text>
                <strong>RSI Value: </strong>
                <Text className={getColorClassFromRange(stockAnalysis.rsi_value, 0, 100, true)}>
                    {stockAnalysis.rsi_value}
                </Text>
            </Text>
            <Text>
                <strong>MACD Value: </strong>
                <Text className={getColorClassFromRange(stockAnalysis.macd_value, -100, 100)}>
                    {stockAnalysis.macd_value}
                </Text>
            </Text>
            <Text>
                <strong>MACD Signal: </strong>
                <Text className={getColorClassFromRange(stockAnalysis.macd_signal, -100, 100)}>
                    {stockAnalysis.macd_signal}
                </Text>
            </Text>
            <Text>
                <strong>Upper Bollinger Band: </strong>
                {stockAnalysis.upper_bollinger_band}
            </Text>
            <Text>
                <strong>Middle Bollinger Band: </strong>
                {stockAnalysis.middle_bollinger_band}
            </Text>
            <Text>
                <strong>Lower Bollinger Band: </strong>
                {stockAnalysis.lower_bollinger_band}
            </Text>
        </Flex>
    </Col>
);

export default Panel2;
