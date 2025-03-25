'use client';

import React from 'react';

import { Button, Flex, notification, Spin } from 'antd';

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
    const [api, contextHolder] = notification.useNotification();
    const { loading, summarisedNews, summarise } = useSummariseNews();

    const [showSummary, setShowSummary] = React.useState(false);
    const [provider, setProvider] = React.useState(AIProvider.DEEPSEEK);

    const hasSummary = React.useMemo(() => summarisedNews !== undefined, [summarisedNews]);

    const handleSummarise = React.useCallback(() => {
        if (!newsData || newsData.length === 0) {
            api.warning({
                message: 'No News Data',
                description: 'There is no news data to summarise.',
            });
            return;
        }
        summarise(stockCode, newsData, provider).then((status) => {
            if (status === 200) {
                setShowSummary(true);
            } else if (status === 429) {
                api.info({
                    message: 'Rate Limit Reached',
                    description: 'Please try again shortly.',
                });
            } else {
                api.error({
                    message: 'Summarisation Failed',
                    description:
                        'An error occurred while summarising the news. Please try again later.',
                });
            }
        });
    }, [newsData, stockCode, provider, summarise]);

    const toggleProvider = React.useCallback(() => {
        setProvider((prevProvider) =>
            prevProvider === AIProvider.OPENAI ? AIProvider.DEEPSEEK : AIProvider.OPENAI,
        );
    }, []);

    return (
        <Flex className="summariser-container">
            {contextHolder}
            {loading ? (
                <Spin aria-label="Loading" className="py-3" />
            ) : hasSummary ? (
                <Button
                    onClick={() => setShowSummary(true)}
                    disabled={loading}
                    color="volcano"
                    variant="solid"
                >
                    View Summary
                </Button>
            ) : (
                <Flex gap="1rem">
                    <ProviderToggle provider={provider} toggleProvider={toggleProvider} />
                    <Button
                        onClick={handleSummarise}
                        disabled={!newsData || newsData.length === 0 || loading}
                        color="blue"
                        variant="solid"
                    >
                        Summarise
                    </Button>
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
