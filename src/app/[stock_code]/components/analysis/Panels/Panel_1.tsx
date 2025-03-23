import React from 'react';

import { Flex, Col, Tooltip } from 'antd';
import Text from 'antd/es/typography/Text';

import { StockAnalysis } from '@/types/stocks';
import { getColorClassFromRange } from '@/utils/colour';

import { analysisRanges } from '@/utils/constants';
import { InfoCircleOutlined } from '@ant-design/icons';

const Panel1 = ({ stockAnalysis }: { stockAnalysis: StockAnalysis }) => (
    <Col
        className="!p-5 text-base border-gray-500 border-2 flex-grow"
        xs={24}
        sm={24}
        md={12}
        lg={8}
    >
        <Flex vertical>
            <Text>
                <strong>Close Price: </strong>
                {stockAnalysis.close_price}
            </Text>
            {stockAnalysis.breakout_percentage !== null ? (
                <>
                    <Text>
                        <strong>Breakout Percentage: </strong>
                        <Text
                            className={getColorClassFromRange(
                                stockAnalysis.breakout_percentage,
                                analysisRanges.breakout_percentage.low,
                                analysisRanges.breakout_percentage.high,
                            )}
                        >
                            {stockAnalysis.breakout_percentage}%{' '}
                        </Text>
                        <Tooltip title="The breakout percentage measures how much the current closing price exceeds the trendline value. A higher value indicates a stronger bullish breakout.">
                            <InfoCircleOutlined />{' '}
                        </Tooltip>
                    </Text>
                    <Text>
                        <strong>Consecutive Days Above Trendline: </strong>
                        <Text
                            className={
                                stockAnalysis.consecutive_days_above_trendline > 1
                                    ? getColorClassFromRange(
                                          stockAnalysis.consecutive_days_above_trendline,
                                          -1,
                                          7,
                                      )
                                    : 'text-gray-500'
                            }
                        >
                            {stockAnalysis.consecutive_days_above_trendline}{' '}
                        </Text>
                        <Tooltip title="Consecutive days above the trendline represent the number of trading days the stock's closing price has remained above the trendline without interruption. It indicates sustained bullish momentum.">
                            <InfoCircleOutlined />{' '}
                        </Tooltip>
                    </Text>
                    <Text>
                        <strong>Trendline Accuracy: </strong>
                        <Text
                            className={getColorClassFromRange(
                                stockAnalysis.trendline_accuracy,
                                0,
                                100,
                            )}
                        >
                            {stockAnalysis.trendline_accuracy}%{' '}
                        </Text>
                        <Tooltip title="Trendline reliability measures how accurately the trendline represents the stock's peaks, expressed as a percentage. Higher reliability indicates a better fit.">
                            <InfoCircleOutlined />{' '}
                        </Tooltip>
                    </Text>
                </>
            ) : (
                <Text className="!my-2 !text-gray-300">Breakout data unavailable</Text>
            )}
        </Flex>
    </Col>
);

export default Panel1;
