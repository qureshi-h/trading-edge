export const analysisRanges = {
    breakout_percentage: {
        low: -20,
        high: 20,
    },
    consecutive_days_above_trendline: {
        low: -1,
        high: 7,
    },
    trendline_accuracy: {
        low: 0,
        high: 70,
    },
    rsi: {
        low: 0,
        high: 100,
    },
    macd: {
        low: -100,
        high: 100,
    },
    volume_ratio: {
        low: 0.5,
        high: 1.5,
    },
    bollinger: {
        low: -100,
        high: 100,
    },
    ema: {
        low: 0.8,
        high: 1.2,
    },
};

export const sectorOptions = [
    'Basic Materials',
    'Communication Services',
    'Consumer Cyclical',
    'Consumer Defensive',
    'Crypto',
    'Energy',
    'Financial Services',
    'Healthcare',
    'Index Funds and ETFs',
    'Industrials',
    'Real Estate',
    'Technology',
    'Utilities',
] as const;

export const MAX_DAYS_ABOVE_TRENDLINE = 5;

export enum AIProvider {
    DEEPSEEK = 'DeepSeek',
    OPENAI = 'OpenAI',
}
