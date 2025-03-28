import { useState, useEffect } from 'react';

import Text from 'antd/es/typography/Text';
import { Flex, Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import '@/styles/modal.css';

const NewsSummary = ({
    text,
    speed,
    open,
    onClose,
}: {
    text: string;
    speed: number;
    open: boolean;
    onClose: () => void;
}) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        if (!open) {
            return;
        }

        let index = displayedText.length;
        const intervalId = setInterval(() => {
            setDisplayedText(text.slice(0, index));
            index += 1;
            if (index === text.length) {
                clearInterval(intervalId);
            }
        }, speed);

        return () => clearInterval(intervalId);
    }, [text, speed, open]);

    return (
        <Modal
            open={open}
            className="!top-0 !w-[100vw] p-0 m-0 !max-w-none"
            footer={null}
            closeIcon={<CloseOutlined className="!text-white p-5" onClick={onClose} />}
        >
            <Flex className="py-28 px-5 !h-[100vh] w-full overflow-y-auto" vertical>
                <Text className="xl:!text-4xl lg:!text-3xl md:!text-2xl sm:!text-xl !text-white whitespace-pre-line">
                    {displayedText}
                </Text>
            </Flex>
        </Modal>
    );
};

export default NewsSummary;
