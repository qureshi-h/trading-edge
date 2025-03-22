'use client';

import React from 'react';
import { Flex, Spin } from 'antd';
import { OpenAIOutlined } from '@ant-design/icons';

import { NewsResponse } from '@/types/news';
import NewsSummary from './Summary';
import { api } from '@/utils/api/api';

const NewsSummariser = ({
    stockCode,
    newsData,
}: {
    stockCode: string;
    newsData?: NewsResponse[];
}) => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [summarisedNews, setSummarisedNews] = React.useState<string>();
    const [showSummary, setShowSummary] = React.useState(false);

    const handleSummarise = () => {
        setLoading(true);
        api.post<{ summary: string }>('/api/news/summarise', {
            stock_code: stockCode,
            news: newsData,
        })
            .then((response) => {
                if (response.status === 200) {
                    setSummarisedNews(response.data.summary);
                    setShowSummary(true);
                } else {
                    throw new Error();
                }
            })
            .catch((e) => console.error('Error whiel summarising news', e))
            .finally(() => setLoading(false));
    };

    return (
        <Flex className="relative">
            {loading ? (
                <Spin />
            ) : summarisedNews ? (
                <button
                    onClick={() => setShowSummary(true)}
                    className="bg-teal-600 hover:bg-teal-700
                  disabled:bg-gray-400 disabled:hover:bg-gray-400
                  text-white font-bold py-2 px-4 rounded"
                >
                    View Summary
                </button>
            ) : (
                <button
                    onClick={handleSummarise}
                    className="bg-blue-500 hover:bg-blue-600
                  disabled:bg-gray-400 disabled:hover:bg-gray-400
                  text-white font-bold py-2 px-4 rounded"
                >
                    Summarise <OpenAIOutlined />
                </button>
            )}
            {summarisedNews !== undefined && (
                <NewsSummary
                    text={summarisedNews}
                    speed={25}
                    onClose={() => {
                        console.log('close');

                        setShowSummary(false);
                    }}
                    open={showSummary}
                />
            )}
        </Flex>
    );
};

export default NewsSummariser;
