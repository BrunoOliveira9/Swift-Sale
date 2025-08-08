import axios, { AxiosInstance, AxiosResponse } from 'axios';

export interface Ientity {
  [key: string]: any;
}

// @ts-ignore
const API_URL = `http://${process.env.REACT_APP_HOST_BACKEND}:${process.env.REACT_APP_PORT_BACKEND}/auth`;

// TReq = tipo de envio (request), TRes = tipo de retorno (response)
export class GenericCrudService<TReq extends Ientity, TRes = TReq> {
    private api: AxiosInstance;

    constructor(baseURL: string = API_URL) {
        this.api = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async list(model: string): Promise<TRes[]> {
        const response: AxiosResponse<TRes[]> = await this.api.get(`/${model}`);
        return response.data;
    }

    async get(model: string, id: string | number): Promise<TRes> {
        const response: AxiosResponse<TRes> = await this.api.get(`/${model}/${id}`);
        return response.data;
    }

    async create(model: string, data: Partial<TReq>): Promise<TRes> {
        console.log(`Creating new ${model} with data:`, data);
        const response: AxiosResponse<TRes> = await this.api.post(`/${model}`, data);
        return response.data;
    }

    async update(model: string, id: string | number, data: Partial<TReq>): Promise<TRes> {
        const response: AxiosResponse<TRes> = await this.api.put(`/${model}/${id}`, data);
        return response.data;
    }

    async delete(model: string, id: string | number): Promise<void> {
        await this.api.delete(`/${model}/${id}`);
    }
}