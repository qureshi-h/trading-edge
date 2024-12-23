export interface Stock {
    exchange: string;
    sector: string;
    stock_id: number;
    stock_name: string;
    stock_symbol: string;
}

export interface HeldStock {
    exchange: string;
    sector: string;
    stock_id: number;
    stock_name: string;
    stock_symbol: string;
    net_units: number;
}
