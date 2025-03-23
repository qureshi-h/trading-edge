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
    resize: (delay?: number) => void;
}

const RESIZE_STEP = 100; // ms
const COLLAPSE_TRANSITION = 300; // ms

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
        collapsible: article.image !== '' || article.summary !== '' ? 'icon' : 'disabled',
    }));
};

const EmptyState = () => (
    <Flex className="w-full p-5" justify="center">
        <Text className="!text-white">Nothing recent found!</Text>
    </Flex>
);

const NewsContainer: React.FC<PageProps> = ({ stockCode, newsData, resize }) => {
    const [expandedRows, setExpandedRows] = React.useState<string[]>([]);
    const items = React.useMemo(() => generateCollapseItems(newsData), [newsData]);

    const handleClick = (key: string[]) => {
        if (expandedRows.length === 1 && key.length === 1 && expandedRows[0] === key[0]) {
            return; // avoid resizing
        }

        setExpandedRows(key);
        for (let i = 1; i <= COLLAPSE_TRANSITION / RESIZE_STEP; i++) {
            resize(i * RESIZE_STEP);
        }
    };

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
                    <Collapse
                        accordion
                        items={items}
                        size="large"
                        onChange={handleClick}
                        activeKey={expandedRows}
                    />
                </Flex>
            ) : (
                <EmptyState />
            )}
        </React.Fragment>
    );
};

export default NewsContainer;
