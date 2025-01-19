import { api, ApiParams } from './api';
import { StockAnalysis, TopStock, TopStockFilters } from '@/types/stocks';

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
    filters: TopStockFilters,
): Promise<TopAnalysisResponse> => {
    try {
        const params: ApiParams = { date, page, size };

        if (filters.sector !== null) {
            params.sector = filters.sector;
        }
        if (filters.daysAboveTrendline !== 5) {
            params.daysAboveTrendline = filters.daysAboveTrendline;
        }
        console.log(params);

        const response = await api.get<TopAnalysisResponse>(`/api/analysis/top`, params);
        return response.status === 200 ? response.data : { rows: [], finalPage: true, page: 0 };
    } catch (err) {
        console.error('Error fetching stock analysis:', err);
        return { rows: [], finalPage: true, page: 0 };
    }
};

export interface TopAnalysisResponse {
    rows: TopStock[];
    page: number;
    finalPage: boolean;
}
