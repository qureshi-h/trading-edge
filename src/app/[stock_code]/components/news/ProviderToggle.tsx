import { Flex, Tooltip } from 'antd';
import { motion } from 'framer-motion';
import { DeepSeek } from '@lobehub/icons';
import { OpenAIOutlined } from '@ant-design/icons';

import { AIProvider } from '@/utils/constants';

export const ProviderToggle = ({
    provider,
    toggleProvider,
}: {
    provider: AIProvider;
    toggleProvider: () => void;
}) => {
    const iconVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
    };

    return (
        <Tooltip title={provider}>
            <Flex onClick={toggleProvider} className="cursor-pointer">
                <motion.div
                    key={provider}
                    initial="hidden"
                    animate="visible"
                    variants={iconVariants}
                    transition={{ duration: 0.3 }}
                >
                    {provider === AIProvider.OPENAI ? (
                        <OpenAIOutlined className="p-0 m-0 !text-white" style={{ fontSize: 30 }} />
                    ) : (
                        <DeepSeek className="h-full p-0 m-0 !text-white" style={{ fontSize: 30 }} />
                    )}
                </motion.div>
            </Flex>
        </Tooltip>
    );
};
