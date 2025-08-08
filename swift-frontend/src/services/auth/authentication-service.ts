import { GenericCrudService } from "../crud/generic-crud-service.ts";
import type { LoginRequest } from "../../models/auth/LoginRequest";
import type { LoginResponse } from "../../models/auth/LoginResponse";

// @ts-ignore
const API_URL = `http://${process.env.REACT_APP_HOST_BACKEND}:${process.env.REACT_APP_PORT_BACKEND}/auth`;

const authService = new GenericCrudService<LoginRequest, LoginResponse>(API_URL);

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    console.log('Enviando credenciais:', credentials);
    const response = await authService.create('login', credentials);
    return response;
  } catch (error) {
    console.error('Erro no login:', error);
    throw new Error('Erro ao realizar login');
  }
};