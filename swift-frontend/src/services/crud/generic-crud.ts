import axios, { AxiosInstance, AxiosResponse } from 'axios';

// @ts-ignore
const backendHost = process.env.REACT_APP_HOST_BACKEND;
// @ts-ignore
const backendPort = process.env.REACT_APP_PORT_BACKEND;
// @ts-ignore'

console.log(backendHost,backendPort)

export interface iEntity {
  [key: string]: any;
}

export class GenericCrudService<TRequest extends iEntity, TResponse = TRequest> {
  private api: AxiosInstance;

  constructor(baseURL: string = `http://${backendHost}:${backendPort}`) {
    this.api = axios.create({
      baseURL,
      withCredentials: true,
    });
  }
  
  async list(model: string): Promise<TResponse[]> {
      const response: AxiosResponse<TResponse[]> = await this.api.get(`${model}`);
      return response.data;
  }

  async get(model: string, id: string | number): Promise<TResponse> {
      const response: AxiosResponse<TResponse> = await this.api.get(`${model}/${id}`);
      return response.data;
  }

  async getAction<TResponse = any>(model: string): Promise<TResponse> {
    const response = await this.api.get<TResponse>(`${model}`);
    return response.data;
  }

  async create(model: string, data: Partial<TRequest>): Promise<TResponse> {
      console.log(`Creating new ${model} with data:`, data);
      const response: AxiosResponse<TResponse> = await this.api.post(`${model}`, data);
      return response.data;
  }

  async postAction(model: string): Promise<TResponse> {
      const response: AxiosResponse<TResponse> = await this.api.post(`${model}`);
      return response.data;
  }

  async update(model: string, id: string | number, data: Partial<TRequest>): Promise<TResponse> {
      const response: AxiosResponse<TResponse> = await this.api.put(`${model}/${id}`, data);
      return response.data;
  }

  async delete(model: string, id: string | number): Promise<void> {
      await this.api.delete(`${model}/${id}`);
  }
  
}

// export const api = axios.create({
//   baseURL: `http://${backendHost}:${backendPort}`,
//   withCredentials: true,
// });