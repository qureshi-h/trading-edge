import React from 'react';

import RecordLogsForms from './components/RecordLogsForms';

import { Stock } from '@/types/stocks';
import { fetchStocks } from '@/utils/api/stocks';

const Page = async () => {
    const stocks: Stock[] = await fetchStocks();

    return (
        <div
            className="flex flex-col items-center justify-center h-screen px-4 md:py-10 lg:py-0"
            style={{
                backgroundImage: `url('/image.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            }}
        >
            <RecordLogsForms stocks={stocks} />
        </div>
    );
};

export default Page;
