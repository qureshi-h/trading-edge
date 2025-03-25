import { motion } from 'framer-motion';

export const AnimatedContainer = ({
    children,
    duration = 0.3,
    ...props
}: {
    children: React.ReactNode;
    duration?: number;
} & React.ComponentProps<typeof motion.div>) => (
    <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration, ease: 'easeInOut' }}
        className="overflow-hidden"
        {...props}
    >
        {children}
    </motion.div>
);
