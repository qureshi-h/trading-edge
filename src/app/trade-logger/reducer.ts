import { HeldStock, Stock } from '@/types/stocks';
import { Dayjs } from 'dayjs';

type StateType = {
    selectedStock: Stock | null;
    isOptions: boolean;
    timeToExpire: string | null;
    tradeDate: Dayjs | undefined;
    currentlyHeldStocks: HeldStock[] | null;
    netUnits: number | undefined;
    tab: string;
};

type ActionType =
    | { type: 'RESET' }
    | { type: 'SET_SELECTED_STOCK'; payload: Stock | null }
    | { type: 'SET_IS_OPTIONS'; payload: boolean }
    | { type: 'SET_TIME_TO_EXPIRE'; payload: string | null }
    | { type: 'SET_TRADE_DATE'; payload: Dayjs | undefined }
    | { type: 'SET_CURRENTLY_HELD_STOCKS'; payload: HeldStock[] | null }
    | { type: 'SET_TAB'; payload: string }
    | { type: 'SET_NET_UNITS'; payload: number | undefined };

export const initialState: StateType = {
    selectedStock: null,
    isOptions: false,
    timeToExpire: null,
    tradeDate: undefined,
    currentlyHeldStocks: null,
    netUnits: undefined,
    tab: 'Buy',
};

export const reducer = (state: StateType, action: ActionType): StateType => {
    switch (action.type) {
        case 'RESET':
            return initialState;
        case 'SET_SELECTED_STOCK':
            return { ...state, selectedStock: action.payload };
        case 'SET_IS_OPTIONS':
            return { ...state, isOptions: action.payload };
        case 'SET_TIME_TO_EXPIRE':
            return { ...state, timeToExpire: action.payload };
        case 'SET_TRADE_DATE':
            return { ...state, tradeDate: action.payload };
        case 'SET_CURRENTLY_HELD_STOCKS':
            return { ...state, currentlyHeldStocks: action.payload };
        case 'SET_NET_UNITS':
            return { ...state, netUnits: action.payload };
        case 'SET_TAB':
            return { ...state, tab: action.payload };
        default:
            return state;
    }
};
