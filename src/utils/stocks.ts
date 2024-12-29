import { api } from './api';
import { Stock, StockAnalysis } from '@/types/stocks';

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

export const fetchStockAnalysis = async (
    stockSymbol: string,
    date: string,
): Promise<StockAnalysis | null> => {
    try {
        const response = await api.get<StockAnalysis>(`/api/analysis/${stockSymbol}`, { date });
        return response.status === 200 ? response.data : null;
    } catch (err) {
        console.error('Error fetching stock analysis:', err);
        return null;
    }
};
