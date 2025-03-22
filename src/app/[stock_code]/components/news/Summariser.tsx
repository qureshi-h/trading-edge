'use client';

import React from 'react';

import { Flex, notification, Spin } from 'antd';

import NewsSummary from './Summary';
import { ProviderToggle } from './ProviderToggle';

import { NewsResponse } from '@/types/news';
import { AIProvider } from '@/utils/constants';
import { useSummariseNews } from '@/app/hooks/useSummariseNews';

interface NewsSummariserProps {
    stockCode: string;
    newsData?: NewsResponse[];
}

const NewsSummariser: React.FC<NewsSummariserProps> = ({ stockCode, newsData }) => {
    const { loading, summarisedNews, summarise } = useSummariseNews();

    const [showSummary, setShowSummary] = React.useState(false);
    const [provider, setProvider] = React.useState(AIProvider.DEEPSEEK);

    const hasSummary = React.useMemo(() => summarisedNews !== undefined, [summarisedNews]);

    const handleSummarise = React.useCallback(() => {
        if (!newsData || newsData.length === 0) {
            notification.warning({
                message: 'No News Data',
                description: 'There is no news data to summarise.',
            });
            return;
        }
        summarise(stockCode, newsData, provider).then((success) => {
            if (success) {
                setShowSummary(true);
            } else {
                notification.error({
                    message: 'Summarisation Failed',
                    description: 'An error occurred while summarising the news.',
                });
            }
        });
    }, [newsData, stockCode, provider, summarise]);

    const toggleProvider = React.useCallback(() => {
        setProvider((prevProvider) =>
            prevProvider === AIProvider.OPENAI ? AIProvider.DEEPSEEK : AIProvider.OPENAI,
        );
    }, []);

    console.log({ summarisedNews });

    return (
        <Flex className="summariser-container">
            {loading ? (
                <Spin aria-label="Loading" />
            ) : hasSummary ? (
                <button
                    onClick={() => setShowSummary(true)}
                    disabled={loading}
                    className="bg-teal-600 hover:bg-teal-700
                              disabled:bg-gray-400 disabled:hover:bg-gray-400
                              text-white font-bold py-2 px-4 rounded"
                >
                    View Summary
                </button>
            ) : (
                <Flex gap="1rem">
                    <ProviderToggle provider={provider} toggleProvider={toggleProvider} />
                    <button
                        onClick={handleSummarise}
                        disabled={!newsData || newsData.length === 0 || loading}
                        className="bg-blue-500 hover:bg-blue-600
                                    disabled:bg-gray-400 disabled:hover:bg-gray-400
                                    text-white font-bold py-2 px-4 rounded"
                    >
                        Summarise
                    </button>
                </Flex>
            )}
            {summarisedNews !== undefined && (
                <NewsSummary
                    text={summarisedNews}
                    speed={25}
                    onClose={() => setShowSummary(false)}
                    open={showSummary}
                />
            )}
        </Flex>
    );
};

export default NewsSummariser;
