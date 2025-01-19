import { Sector } from '@/types/general';
import { MAX_DAYS_ABOVE_TRENDLINE, sectorOptions } from './constants';

export const validateSector = (sector: string | undefined): Sector | null => {
    return sectorOptions.includes(sector as Sector) ? (sector as Sector) : null;
};

export const validateDaysAboveTrendline = (value: string | undefined): number => {
    const parsedValue = parseInt(value || '', 10);
    return parsedValue >= 1 && parsedValue <= MAX_DAYS_ABOVE_TRENDLINE ? parsedValue : MAX_DAYS_ABOVE_TRENDLINE;
};