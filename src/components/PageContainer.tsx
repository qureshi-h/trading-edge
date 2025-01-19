import React from 'react';
import Link from 'next/link';
import { Flex, Menu } from 'antd';
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
        <Layout className="min-h-full">
            <Header className="fixed w-fit z-10 bg-transparent mx-5 px-0" hasSider={false}>
                <Menu
                    mode="horizontal"
                    items={[
                        {
                            key: '/',
                            label: (
                                <Link href="/">
                                    <HomeFilled className="!text-white" />
                                </Link>
                            ),
                        },
                    ]}
                    className="bg-transparent"
                ></Menu>
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
