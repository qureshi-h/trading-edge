import React from 'react';

import RecordLogsForms from './RecordLogsForms';

import { api } from '@/utils/api';
import { Stock } from '@/types/stocks';

const Page = async () => {
    const stocks: Stock[] = await api
        .get('/api/stocks/all')
        .then((response) => response.data)
        .catch((err) => {
            console.error(err);
            return [];
        });

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen p-4"
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
