'use client';

import React, { Suspense } from 'react';
import { Tabs, Spin } from 'antd';
import dayjs from 'dayjs';

interface DateTabsProps {
    dates: string[];
    renderContent: (date: string, index: number) => React.ReactNode;
    defaultActiveKey?: string;
    tabPosition?: 'top' | 'left' | 'right' | 'bottom';
    className?: string;
}

const DateTabs: React.FC<DateTabsProps> = ({
    dates,
    renderContent,
    defaultActiveKey = '0',
    tabPosition = 'top',
    className,
}) => {
    const tabItems = dates.map((date, index) => ({
        key: index.toString(),
        label: index === 0 ? 'Today' : dayjs(date).format('DD MMM'),
        children: (
            <Suspense fallback={<Spin tip="Loading..." />}>{renderContent(date, index)}</Suspense>
        ),
    }));

    return (
        <Tabs
            defaultActiveKey={defaultActiveKey}
            tabPosition={tabPosition}
            items={tabItems}
            className={className}
        />
    );
};

export default DateTabs;
