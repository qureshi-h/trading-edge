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

export interface ApiError {
    status: number;
    message: string;
    details?: string;
}

type FetchError = Error & {
    name: string;
    status?: number;
    message: string;
};

const DEFAULT_TIMEOUT = 10000;

export const api = {
    get: async <T>(
        endpoint: string,
        params: ApiParams = {},
        customHeaders: HeadersInit = {},
        apiUrl: string = API_URL,
        timeout: number = DEFAULT_TIMEOUT,
    ): Promise<ApiResponse<T>> => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const url = new URL(endpoint, apiUrl);
            Object.keys(params).forEach((key) => url.searchParams.append(key, String(params[key])));

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...customHeaders,
                },
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            const data = await response.json();
            return {
                data,
                status: response.status,
            };
        } catch (error: unknown) {
            clearTimeout(timeoutId);

            // Type guard for Error
            const isError = (e: unknown): e is FetchError => e instanceof Error;

            if (isError(error)) {
                if (error.name === 'AbortError') {
                    throw {
                        status: 408,
                        message: 'Request timeout',
                        details: `Request took longer than ${timeout}ms`,
                    } satisfies ApiError;
                }
            }

            throw {
                status: 500,
                message: 'Network error',
                details: isError(error) ? error.message : 'Unknown error occurred',
            } satisfies ApiError;
        }
    },

    post: async <T>(
        endpoint: string,
        body: object,
        customHeaders: HeadersInit = {},
        apiUrl: string = API_URL,
        timeout: number = DEFAULT_TIMEOUT,
    ): Promise<ApiResponse<T>> => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(new URL(endpoint, apiUrl).toString(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...customHeaders,
                },
                body: JSON.stringify(body),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            const data = await response.json();
            return {
                data,
                status: response.status,
            };
        } catch (error: unknown) {
            clearTimeout(timeoutId);

            const isError = (e: unknown): e is FetchError => e instanceof Error;

            if (isError(error)) {
                if (error.name === 'AbortError') {
                    throw {
                        status: 408,
                        message: 'Request timeout',
                        details: `Request took longer than ${timeout}ms`,
                    } satisfies ApiError;
                }
            }

            throw {
                status: 500,
                message: 'Network error',
                details: isError(error) ? error.message : 'Unknown error occurred',
            } satisfies ApiError;
        }
    },
};
