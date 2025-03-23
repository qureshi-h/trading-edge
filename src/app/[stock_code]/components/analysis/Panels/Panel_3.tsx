import React from 'react';

import CountUp from 'react-countup';
import Text from 'antd/es/typography/Text';
import { Flex, Col, Statistic, StatisticProps } from 'antd';

import { StockAnalysis } from '@/types/stocks';
import { getColorClassFromRange } from '@/utils/colour';

import { analysisRanges } from '@/utils/constants';

const formatter: StatisticProps['formatter'] = (value) => (
    <CountUp end={value as number} separator="," />
);

const Panel3 = ({ stockAnalysis }: { stockAnalysis: StockAnalysis }) => (
    <Col
        className="!p-5 text-base border-gray-500 border-2 flex-grow"
        xs={24}
        sm={24}
        md={12}
        lg={8}
    >
        <Flex vertical>
            <Text>
                <strong>Volume: </strong>
                <CountUp end={stockAnalysis.volume as number} separator="," />
            </Text>
            <Text>
                <strong>Volume Ratio: </strong>
                <Text
                    className={getColorClassFromRange(
                        stockAnalysis.volume_ratio,
                        analysisRanges.volume_ratio.low,
                        analysisRanges.volume_ratio.high,
                    )}
                >
                    {stockAnalysis.volume_ratio}
                </Text>
            </Text>
            <Text>
                <strong>9 EMA: </strong>
                <Text
                    className={getColorClassFromRange(
                        stockAnalysis.nine_ema,
                        stockAnalysis.close_price * 0.8,
                        stockAnalysis.close_price * 1.2,
                        true,
                    )}
                >
                    {stockAnalysis.nine_ema}
                </Text>
            </Text>
            <Text>
                <strong>12 EMA: </strong>
                <Text
                    className={getColorClassFromRange(
                        stockAnalysis.twelve_ema,
                        stockAnalysis.close_price * 0.8,
                        stockAnalysis.close_price * 1.2,
                        true,
                    )}
                >
                    {stockAnalysis.twelve_ema}
                </Text>
            </Text>
            <Text>
                <strong>21 EMA: </strong>
                <Text
                    className={getColorClassFromRange(
                        stockAnalysis.twenty_one_ema,
                        stockAnalysis.close_price * 0.8,
                        stockAnalysis.close_price * 1.2,
                        true,
                    )}
                >
                    {stockAnalysis.twenty_one_ema}
                </Text>
            </Text>
            <Text>
                <strong>50 EMA: </strong>
                <Text
                    className={getColorClassFromRange(
                        stockAnalysis.fifty_ema,
                        stockAnalysis.close_price * 0.8,
                        stockAnalysis.close_price * 1.2,
                        true,
                    )}
                >
                    {stockAnalysis.fifty_ema}
                </Text>
            </Text>
        </Flex>
    </Col>
);

export default Panel3;
