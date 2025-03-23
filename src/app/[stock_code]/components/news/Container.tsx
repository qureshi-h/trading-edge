import React from 'react';
import Link from 'next/link';

import Text from 'antd/es/typography/Text';
import { Collapse, Flex, Image } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import NewsSummariser from './Summariser';

import type { CollapseProps } from 'antd';
import { NewsResponse } from '@/types/news';

import '@/styles/collapse.css';

interface PageProps {
    stockCode: string;
    newsData: NewsResponse[];
}

const generateCollapseItems = (newsData: NewsResponse[]): CollapseProps['items'] => {
    return newsData.map((article: NewsResponse, index: number) => ({
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
            <Link
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-5"
                aria-label="Open article in new tab"
            >
                <ExportOutlined className="!text-white hover:!text-blue-500" />
            </Link>
        ),
    }));
};

const EmptyState = () => (
    <Flex className="w-full p-3" justify="center">
        <Text className="!text-white">Nothing recent found!</Text>
    </Flex>
);

const NewsContainer: React.FC<PageProps> = ({ stockCode, newsData }) => {
    const items = React.useMemo(() => generateCollapseItems(newsData), [newsData]);

    return (
        <React.Fragment>
            {newsData.length > 0 ? (
                <Flex
                    vertical
                    gap="1rem"
                    align="center"
                    className="max-h-[70vh] overflow-y-auto w-full p-3"
                >
                    <NewsSummariser newsData={newsData} stockCode={stockCode} />
                    <Collapse accordion items={items} size="large" />
                </Flex>
            ) : (
                <EmptyState />
            )}
        </React.Fragment>
    );
};

export default NewsContainer;
