import { sectorOptions } from '@/utils/constants';

export type GenericObject = Record<string, string | number | boolean>;

export type Sector = (typeof sectorOptions)[number];
