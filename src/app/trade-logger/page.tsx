import React from 'react';

import RecordLogsForms from './RecordLogsForms';

import { api } from '@/utils/api';
import { Stock } from '@/types/stocks';

const Page = async () => {
    const stocks: Stock[] = await api
        .get<Stock[]>('/api/stocks/all')
        .then((response) => response.data)
        .catch((err) => {
            console.error(err);
            return [];
        });

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen px-4 py-10 max-h-screen"
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
