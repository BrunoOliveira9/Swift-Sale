import { AxiosResponse } from 'axios';
import { api } from '../connection-validator.tsx';

export interface iEntity {
  [key: string]: any;
}

export class GenericCrudService<TRequest extends iEntity, TResponse = TRequest> {
  
  async list(model: string): Promise<TResponse[]> {
      const response: AxiosResponse<TResponse[]> = await api.get(`${model}`);
      return response.data;
  }

  async get(model: string, id: string | number): Promise<TResponse> {
      const response: AxiosResponse<TResponse> = await api.get(`${model}/${id}`);
      return response.data;
  }

  async getAction<TResponse = any>(model: string): Promise<TResponse> {
    const response = await api.get<TResponse>(`${model}`);
    return response.data;
  }

  async create(model: string, data: Partial<TRequest>): Promise<TResponse> {
      const response: AxiosResponse<TResponse> = await api.post(`${model}`, data);
      return response.data;
  }

  async postAction(model: string): Promise<TResponse> {
      const response: AxiosResponse<TResponse> = await api.post(`${model}`);
      return response.data;
  }

  async update(model: string, id: string | number, data: Partial<TRequest>): Promise<TResponse> {
      const response: AxiosResponse<TResponse> = await api.put(`${model}/${id}`, data);
      return response.data;
  }

  async delete(model: string, id: string | number): Promise<void> {
      await api.delete(`${model}/${id}`);
  }
}