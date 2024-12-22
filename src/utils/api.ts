// const API_URL = 'http://localhost:5001';
const API_URL = 'http://170.64.209.213:5001';

interface ApiResponse<T = unknown> {
    data: T;
    status: number;
}

interface ApiParams {
    [key: string]: string | number | boolean;
}

export const api = {
    get: async <T>(endpoint: string, params: ApiParams = {}): Promise<ApiResponse<T>> => {
        const url = new URL(endpoint, API_URL);
        Object.keys(params).forEach((key) => url.searchParams.append(key, String(params[key])));

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        return { data, status: response.status };
    },

    post: async <T>(endpoint: string, body: object): Promise<ApiResponse<T>> => {
        const response = await fetch(new URL(endpoint, API_URL).toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return { data, status: response.status };
    },
};
