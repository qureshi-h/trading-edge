import React, { useEffect } from 'react';
import Link from 'next/link';

import Text from 'antd/es/typography/Text';
import { Collapse, Flex, Image } from 'antd';
import { ExportOutlined } from '@ant-design/icons';

import NewsSummariser from './Summariser';

import type { CollapseProps } from 'antd';
import { NewsResponse } from '@/types/news';

import '@/styles/collapse.css';

interface NewsContainerProps {
    stockCode: string;
    newsData: NewsResponse[];
}

const COLLAPSE_TRANSITION = 300; // ms

const generateCollapseItems = (newsData: NewsResponse[]): CollapseProps['items'] => {
    return newsData.map((article: NewsResponse, index: number) => ({
        key: 'news-panel-' + index.toString(),
        label: (
            <Text id={'header-news-panel-' + index.toString()} className="text-sm sm:text-base">
                {article.headline}
            </Text>
        ),
        children: (
            <Flex vertical align="center">
                {article.image && (
                    <Image
                        src={article.image}
                        alt="article image"
                        className="mb-5 mt-2 max-h-48 sm:max-h-96 !w-auto"
                        preview={false}
                    />
                )}
                <Text className="!text-black text-sm sm:text-base">{article.summary}</Text>
            </Flex>
        ),
        extra: (
            <Link
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 sm:ml-5"
                aria-label="Open article in new tab"
            >
                <ExportOutlined className="!text-white hover:!text-blue-500" />
            </Link>
        ),
        collapsible: article.image !== '' || article.summary !== '' ? 'header' : 'disabled',
    }));
};

const EmptyState = () => (
    <Flex className="w-full p-3 sm:p-5" justify="center">
        <Text className="!text-white text-sm sm:text-base">Nothing recent found!</Text>
    </Flex>
);

const NewsContainer: React.FC<NewsContainerProps> = ({ stockCode, newsData }) => {
    const [expandedRows, setExpandedRows] = React.useState<string[]>([]);
    const items = React.useMemo(() => generateCollapseItems(newsData), [newsData]);

    const handleClick = (key: string[]) => {
        setExpandedRows(key);
    };

    useEffect(() => {
        const scrollCollapseContent = () => {
            if (expandedRows.length > 0) {
                const panelKey = expandedRows[0];
                const panelElement = document.getElementById('header-' + panelKey);
                if (panelElement) {
                    panelElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        };

        const timeoutId = setTimeout(scrollCollapseContent, COLLAPSE_TRANSITION);

        return () => clearTimeout(timeoutId);
    }, [expandedRows]);

    return (
        <React.Fragment>
            {newsData.length > 0 ? (
                <Flex
                    vertical
                    gap="0.5rem"
                    align="center"
                    className="max-h-[70vh] overflow-y-auto w-full p-2 sm:p-3"
                >
                    <NewsSummariser newsData={newsData} stockCode={stockCode} />
                    <Collapse
                        accordion
                        items={items}
                        size="large"
                        onChange={handleClick}
                        activeKey={expandedRows}
                        className="!w-full"
                        expandIconPosition="end"
                    />
                </Flex>
            ) : (
                <EmptyState />
            )}
        </React.Fragment>
    );
};

export default NewsContainer;
