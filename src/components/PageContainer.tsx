import React from 'react';
import { Flex } from 'antd';

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
    );
};

export default PageContainer;
