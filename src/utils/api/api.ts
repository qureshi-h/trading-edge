import { GenericObject } from '@/types/general';

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined in the environment variables.');
}

interface ApiResponse<T = unknown> {
    data: T;
    status: number;
}

export interface ApiParams {
    [key: string]: string | number | boolean | GenericObject;
}

export const api = {
    get: async <T>(
        endpoint: string,
        params: ApiParams = {},
        customHeaders: HeadersInit = {},
        apiUrl: string = API_URL,
    ): Promise<ApiResponse<T>> => {
        const url = new URL(endpoint, apiUrl);
        Object.keys(params).forEach((key) => url.searchParams.append(key, String(params[key])));

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                // 'Content-Type': 'application/json',
                ...customHeaders,
            },
        });

        const data = await response.json();
        return { data, status: response.status };
    },

    post: async <T>(
        endpoint: string,
        body: object,
        customHeaders: HeadersInit = {},
        apiUrl: string = API_URL,
    ): Promise<ApiResponse<T>> => {
        const response = await fetch(new URL(endpoint, apiUrl).toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...customHeaders,
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return { data, status: response.status };
    },
};
