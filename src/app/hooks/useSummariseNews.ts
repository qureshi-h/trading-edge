import React from 'react';

import { api } from '@/utils/api/api';
import { NewsResponse } from '@/types/news';
import { AIProvider } from '@/utils/constants';
import { newsSummary } from '@/utils/testing/sampleData';

export const useSummariseNews = () => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [summarisedNews, setSummarisedNews] = React.useState<string>();

    const testingMode = process.env.NEXT_PUBLIC_AI_TESTING_MODE === 'true' || false;

    /**
     * Summarises news data for a given stock code using the specified AI provider.
     *
     * @param stockCode - The stock code to summarise news for.
     * @param newsData - The news data to summarise.
     * @param provider - The AI provider to use for summarisation.
     * @returns A boolean indicating whether the operation was successful.
     */
    const summarise = async (
        stockCode: string,
        newsData: NewsResponse[],
        provider: AIProvider,
    ): Promise<boolean> => {
        setLoading(true);

        if (testingMode) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    setSummarisedNews(newsSummary);
                    setLoading(false);
                    resolve(true);
                }, 1000);
            });
        }

        try {
            const response = await api.post<{ summary: string }>('/api/news/summarise', {
                stock_code: stockCode,
                news: newsData,
                provider: provider.toLowerCase(),
            });

            if (response.status === 200) {
                setSummarisedNews(response.data.summary);
                return true;
            }

            console.error('Unexpected status code:', response.status);
            return false;
        } catch (e) {
            console.error('Error while summarising news:', e);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { loading, summarisedNews, summarise };
};
