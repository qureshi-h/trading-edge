import { Sector } from './general';

export interface Stock {
    exchange: string;
    sector: string;
    stock_id: number;
    stock_name: string;
    stock_symbol: string;
}

export interface HeldStock extends Stock {
    net_units: number;
}

export interface StockAnalysis {
    analysis_id: number;
    stock_id: number;
    analysis_date: string;
    analysis_period: string;
    close_price: number;
    breakout_percentage: number;
    consecutive_days_above_trendline: number;
    trendline_accuracy: number;
    rsi_value: number;
    macd_value: number;
    macd_signal: number;
    upper_bollinger_band: number;
    middle_bollinger_band: number;
    lower_bollinger_band: number;
    volume_ratio: number;
    created_at: string;
    volume: number;
    nine_ema: number;
    twelve_ema: number;
    twenty_one_ema: number;
    fifty_ema: number;
    image: string;
}

export interface TopStock extends StockAnalysis {
    stock_symbol: string;
    stock_name: string;
    sector: string;
}

export interface TopStockFilters {
    sector: Sector | null;
    dat: number;
}
