import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const httpService = {
    get,
    post,
    put,
    patch,
    delete: _delete
}

async function get(url: string, options?: AxiosRequestConfig): Promise<AxiosResponse> {
    try {
        const res = await axios.get(url, options);
        return res;
    } catch (err: any) {
        if (err.response && (err.response.status === 403 || err.response.status === 401)) {
            await refreshToken(() => get(url, options)); // Passar a função corretamente
            return await get(url, options); // Reexecuta a chamada original
        }
        throw new Error(err.message);
    }
}

async function post(url: string, body: any, options?: AxiosRequestConfig): Promise<AxiosResponse> {
    try {
        const res = await axios.post(url, body, options);
        return res;
    } catch (err: any) {
        if (err.response && (err.response.status === 403 || err.response.status === 401)) {
            await refreshToken(() => post(url, body, options)); // Passar a função corretamente
            return await post(url, body, options); // Reexecuta a chamada original
        }
        throw new Error(err.message);
    }
}

async function put(url: string, body: any, options?: AxiosRequestConfig): Promise<AxiosResponse> {
    try {
        const res = await axios.put(url, body, options);
        return res;
    } catch (err: any) {
        if (err.response && (err.response.status === 403 || err.response.status === 401)) {
            await refreshToken(() => put(url, body, options)); // Passar a função corretamente
            return await put(url, body, options); // Reexecuta a chamada original
        }
        throw new Error(err.message);
    }
}

async function patch(url: string, body: any, options?: AxiosRequestConfig): Promise<AxiosResponse> {
    try {
        const res = await axios.patch(url, body, options);
        return res;
    } catch (err: any) {
        if (err.response && (err.response.status === 403 || err.response.status === 401)) {
            await refreshToken(() => patch(url, body, options)); // Passar a função corretamente
            return await patch(url, body, options); // Reexecuta a chamada original
        }
        throw new Error(err.message);
    }
}

async function _delete(url: string, options?: AxiosRequestConfig): Promise<AxiosResponse> {
    try {
        const res = await axios.delete(url, options);
        return res;
    } catch (err: any) {
        if (err.response && (err.response.status === 403 || err.response.status === 401)) {
            await refreshToken(() => _delete(url, options)); // Passar a função corretamente
            return await _delete(url, options); // Reexecuta a chamada original
        }
        throw new Error(err.message);
    }
}

async function refreshToken(callback: any) {
    try {
        const refreshToken = sessionStorage.getItem('refresh_token') || '';

        const newTokenReq = await axios.post(`${process.env.REACT_APP_API_URL}/v1/authentication/refresh-token`, {}, {
            headers: {
                refresh_token: refreshToken
            }
        });

        // Armazenando os novos tokens no sessionStorage
        sessionStorage.setItem('refresh_token', newTokenReq.data.refresh_token);
        sessionStorage.setItem('access_token', newTokenReq.data.access_token);
        callback(); // Chama a função original para reexecutar a requisição
    } catch (err: any) {
        throw new Error(err.message);
    }
}

export default httpService;