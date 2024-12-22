// const API_URL = 'http://localhost:5001';
const API_URL = 'http://170.64.209.213:5001';

interface ApiResponse {
    data: any;
    status: number;
}

interface ApiParams {
    [key: string]: string | number | boolean;
}

export const api = {
    get: async (endpoint: string, params: ApiParams = {}): Promise<ApiResponse> => {
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

    post: async (endpoint: string, body: object): Promise<ApiResponse> => {
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
