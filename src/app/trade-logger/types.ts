import { HeldStock, Stock } from "@/types/stocks";
import { Dayjs } from "dayjs";

export type StateType = {
    selectedStock: Stock | null;
    isOptions: boolean;
    timeToExpire: string | null;
    tradeDate: Dayjs | undefined;
    currentlyHeldStocks: HeldStock[] | null;
    netUnits: number | undefined;
    tab: string;
};
