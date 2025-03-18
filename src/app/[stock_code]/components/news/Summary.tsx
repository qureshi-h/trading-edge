import { useState, useEffect } from 'react';

import Text from 'antd/es/typography/Text';
import { Flex } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const NewsSummary = ({
    text,
    speed,
    onClose,
}: {
    text: string;
    speed: number;
    onClose: () => void;
}) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let index = 0;
        const intervalId = setInterval(() => {
            setDisplayedText(text.slice(0, index));
            index += 1;
            if (index === text.length) {
                clearInterval(intervalId);
            }
        }, speed);

        return () => clearInterval(intervalId);
    }, [text, speed]);

    return (
        <Flex
            className="h-screen w-screen z-10 bg-black/80 fixed top-0 left-0 px-28 pb-28"
            vertical
            align="flex-end"
            style={{ top: 0, left: 0 }} // Ensure it starts at the viewport's top-left
        >
            <CloseOutlined
                className="!text-3xl !text-white py-14 cursor-pointer"
                onClick={onClose}
            />
            <Flex align="center" className="w-full">
                <Text className="!text-5xl !text-white">{displayedText}</Text>
            </Flex>
        </Flex>
    );
};

export default NewsSummary;
