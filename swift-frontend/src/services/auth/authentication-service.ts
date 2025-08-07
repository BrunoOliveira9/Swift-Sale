import axios from 'axios';

// @ts-ignore
const API_URL = `http://${process.env.REACT_APP_HOST_BACKEND}:${process.env.REACT_APP_PORT_BACKEND}/auth`;

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    return response.data;
  } catch (error) {
    throw new Error('Erro ao realizar login');
  }
};
