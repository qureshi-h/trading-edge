'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import Text from 'antd/es/typography/Text';
import { Collapse, Flex, Image, notification, Spin } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import NewsSummariser from './Summariser';

import type { CollapseProps } from 'antd';
import { NewsResponse } from '@/types/news';
import { getDateFormatted } from '@/utils/dates';

import '@/styles/collapse.css';

const Page = ({ stock_code }: { stock_code: string }) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const to = getDateFormatted(today);
    const from = getDateFormatted(yesterday);

    const [newsData, setNewsData] = useState<NewsResponse[]>();

    useEffect(() => {
        const fetchStockAnalysis = () => {
            fetch(`/api/company-news?symbol=NVDA&from=${from}&to=${to}`)
                .then((res) => res.json())
                .then((data) => {
                    if ('error' in data) {
                        throw Error(data.error as string);
                    } else {
                        setNewsData(data as NewsResponse[]);
                    }
                })
                .catch((error) => {
                    console.error(error);
                    notification.error({ message: `Error fetching news for ${stock_code}` });
                });
        };
        fetchStockAnalysis();
    }, []);

    if (newsData === undefined) return <Spin className="w-full" />;

    const items: CollapseProps['items'] = newsData?.map((article: NewsResponse, index: number) => ({
        key: index.toString(),
        label: article.headline,
        children: (
            <Flex vertical align="center">
                {article.image && (
                    <Image
                        src={article.image}
                        alt="article image"
                        className="mb-5 mt-2 max-h-96 !w-auto"
                    />
                )}
                <Text className="!text-black">{article.summary}</Text>
            </Flex>
        ),
        extra: (
            <Link href={article.url} target="_blank" rel="noopener noreferrer" className="ml-5">
                <ExportOutlined className="!text-white hover:!text-blue-500" />
            </Link>
        ),
    }));

    return (
        <React.Fragment>
            {newsData.length > 0 ? (
                <Flex vertical gap="1rem" align="center" className="max-h-[70vh] overflow-y-auto">
                    <NewsSummariser newsData={newsData} />
                    <Collapse accordion items={items} size="large" />
                </Flex>
            ) : (
                <Text className="!text-white">Nothing recent found!</Text>
            )}
        </React.Fragment>
    );
};

export default Page;
