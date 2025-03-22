import React from 'react';
import Link from 'next/link';

import Text from 'antd/es/typography/Text';
import { Collapse, Flex, Image } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import NewsSummariser from './Summariser';

import type { CollapseProps } from 'antd';
import { NewsResponse } from '@/types/news';

import '@/styles/collapse.css';

const Page = ({ stockCode, newsData }: { stockCode: string; newsData: NewsResponse[] }) => {
    const items: CollapseProps['items'] = newsData.map((article: NewsResponse, index: number) => ({
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
                <Text className="!text-white">Nothing recent found!</Text>
            )}
        </React.Fragment>
    );
};

export default Page;
