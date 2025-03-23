import React, { useMemo, memo } from 'react';

import { Flex, FloatButton } from 'antd';
import { HomeFilled } from '@ant-design/icons';
import Layout, { Content } from 'antd/es/layout/layout';

interface PageContainerProps {
    children: React.ReactNode;
    vertical?: boolean;
    align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
    justify?: 'start' | 'center' | 'end' | 'space-around' | 'space-between' | 'space-evenly';
    className?: string;
    style?: React.CSSProperties;
    backgroundImage?: string;
}

const HomeButton = () => (
    <FloatButton
        icon={<HomeFilled />}
        type="primary"
        tooltip="Go to Home"
        aria-label="Go to Home"
        style={{
            right: 24,
            bottom: 24,
        }}
        href="/"
    />
);

const PageContainer: React.FC<PageContainerProps> = memo(
    ({
        children,
        style = {},
        className = 'min-h-screen px-4 md:py-10 lg:py-0',
        align = 'center',
        vertical = true,
        justify = 'center',
        backgroundImage = '/image.png',
    }) => {
        const containerStyle = useMemo(
            () => ({
                backgroundImage: backgroundImage ? `url('${backgroundImage}')` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                ...style,
            }),
            [backgroundImage, style],
        );

        return (
            <Layout className="min-h-full" hasSider={false}>
                <HomeButton />
                <Content>
                    <Flex
                        vertical={vertical}
                        align={align}
                        justify={justify}
                        className={className}
                        style={containerStyle}
                    >
                        {children}
                    </Flex>
                </Content>
            </Layout>
        );
    },
);

PageContainer.displayName = 'PageContainer';

export default PageContainer;
