'use client';

import React from 'react';
import { Flex, Spin } from 'antd';
import { OpenAIOutlined } from '@ant-design/icons';

import { api } from '@/utils/api/api';
import { NewsResponse } from '@/types/news';
import NewsSummary from './Summary';

const NewsSummariser = ({ newsData }: { newsData?: NewsResponse[] }) => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [summarisedNews, setSummarisedNews] = React.useState<string>();
    const [showSummary, setShowSummary] = React.useState(false);

    const handleSummarise = () => {
        setLoading(true);
        api.post<{ summary: string }>('/api/news/summarise', { news: newsData })
            .then((response) => {
                if (response.status === 200) {
                    console.log(response.data.summary);
                    setSummarisedNews(response.data.summary);
                } else {
                    throw new Error();
                }
            })
            .catch((e) => console.error('Error whiel summarising news', e))
            .finally(() => setLoading(false));
    };

    return (
        <Flex>
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
            {showSummary && summarisedNews && (
                <NewsSummary
                    text={summarisedNews}
                    speed={25}
                    onClose={() => setShowSummary(false)}
                />
            )}
        </Flex>
    );
};

export default NewsSummariser;
