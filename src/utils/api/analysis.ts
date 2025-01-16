import { GenericObject } from '@/types/general';
import { api } from './api';
import { StockAnalysis, TopStock } from '@/types/stocks';

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

export const fetchTopAnalysis = async (
    date: string,
    page = 0,
    size = 20,
    sectorFilter: string = 'All',
): Promise<{ rows: TopStock[]; finalPage: boolean } | null> => {
    try {
        const params: GenericObject = { date, page, size };
        if (sectorFilter !== 'All') {
            params.sector = sectorFilter;
        }

        const response = await api.get<{ rows: TopStock[]; finalPage: boolean }>(
            `/api/analysis/top`,
            params,
        );
        return response.status === 200 ? response.data : null;
    } catch (err) {
        console.error('Error fetching stock analysis:', err);
        return null;
    }
};
