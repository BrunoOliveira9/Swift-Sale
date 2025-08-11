import axios from 'axios';
import showToast from '../components/toast/Toast'; 

// @ts-ignore
const backendHost = process.env.REACT_APP_HOST_BACKEND;
// @ts-ignore
const backendPort = process.env.REACT_APP_PORT_BACKEND;

export const api = axios.create({
  baseURL: `http://${backendHost}:${backendPort}`,
  withCredentials: true,
});

// interceptor da resposta para captura erros antes que eles cheguem no código
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      showToast('error', 'Conexão perdida', 'Não foi possível estabelecer a conexão com o servidor. A ação será abortada.');
    }
    return Promise.reject(error);
  }
);