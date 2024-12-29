import React from 'react';
import { Tabs } from 'antd';
import dayjs from 'dayjs';

import '@/app/style.css';

const StockAnalysis = () => {
    const getDatesExcludingWeekends = () => {
        const dates = [];
        let currentDate = dayjs();
        while (dates.length < 7) {
            if (currentDate.day() !== 0 && currentDate.day() !== 6) {
                dates.push(currentDate.format('YYYY-MM-DD'));
            }
            currentDate = currentDate.subtract(1, 'day');
        }
        return dates.reverse();
    };

    const dates = getDatesExcludingWeekends();

    const tabItems = dates.map((date, index) => ({
        key: index.toString(),
        label: date,
        children: <p>Content for {date}</p>,
    }));

    return <Tabs defaultActiveKey="1" tabPosition="top" items={tabItems} className="custom-tabs" />;
};

export default StockAnalysis;
