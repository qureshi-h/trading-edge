import { api } from './api';
import { Stock, StockBySector } from '@/types/stocks';

export const fetchStock = async (stockCode: string): Promise<Stock | null> => {
    try {
        const response = await api.get<Stock>(`/api/stock/${stockCode}`);
        return response.data;
    } catch (err) {
        console.error('Error fetching stocks:', err);
        return null;
    }
};

export const fetchStocks = async (): Promise<Stock[]> => {
    try {
        const response = await api.get<Stock[]>('/api/stocks/all');
        return response.status === 200 ? response.data : [];
    } catch (err) {
        console.error('Error fetching stocks:', err);
        return [];
    }
};

export const fetchStocksBySector = async (): Promise<StockBySector[]> => {
    try {
        const response = await api.get<StockBySector[]>('/api/stocks/sector');
        return response.status === 200 ? response.data : [];
    } catch (err) {
        console.error('Error fetching stocks:', err);
        return [];
    }
};
