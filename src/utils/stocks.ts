import { api } from './api';
import { Stock } from '@/types/stocks';

export const fetchStocks = async (): Promise<Stock[]> => {
    try {
        const response = await api.get<Stock[]>('/api/stocks/all');
        return response.data;
    } catch (err) {
        console.error('Error fetching stocks:', err);
        return [];
    }
};
