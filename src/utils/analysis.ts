import { api } from "./api";
import { StockAnalysis } from "@/types/stocks";

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
