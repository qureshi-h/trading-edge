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
