import React from 'react';
import Link from 'next/link';

import { Flex } from 'antd';
import { HomeFilled } from '@ant-design/icons';
import Layout, { Content, Header } from 'antd/es/layout/layout';

interface PageContainerProps {
    children: React.ReactNode;
    vertical?: boolean;
    align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
    justify?: 'start' | 'center' | 'end' | 'space-around' | 'space-between' | 'space-evenly';
    className?: string;
    style?: React.CSSProperties;
    backgroundImage?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({
    children,
    style = {},
    className = 'min-h-screen px-4 md:py-10 lg:py-0',
    align = 'center',
    vertical = true,
    justify = 'center',
    backgroundImage = `/image.png`,
}) => {
    return (
        <Layout className="min-h-full" hasSider={false}>
            <Header className="fixed w-fit bg-transparent z-20 ml-10 mt-5 md:ml-10 md:mt-0 px-0">
                <Link href="/">
                    <HomeFilled className="!text-white" />
                </Link>
            </Header>

            {/* Main Content Area */}
            <Content>
                <Flex
                    vertical={vertical}
                    align={align}
                    justify={justify}
                    className={className}
                    style={{
                        backgroundImage: backgroundImage ? `url('${backgroundImage}')` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundAttachment: 'fixed',
                        ...style,
                    }}
                >
                    {children}
                </Flex>
            </Content>
        </Layout>
    );
};

export default PageContainer;
