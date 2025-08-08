import axios from 'axios';

// @ts-ignore
const API_URL = `http://${process.env.REACT_APP_HOST_BACKEND}:${process.env.REACT_APP_PORT_BACKEND}/auth`;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ESSENCIAL!! sem withCredentials: true, o navegador iria ignorar o cookie contendo o token porque a requisição foi feita de um domínio diferente (localhost:3000 para localhost:3005).
});

export const login = async (username: string, password: string) => {
  try {
    const response = await api.post(`/login`, { username, password });
    return response.data;
  } catch (error) {
    throw new Error('Erro ao realizar login');
  }
};