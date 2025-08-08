import axios from 'axios';

// @ts-ignore
const backendHost = process.env.REACT_APP_HOST_BACKEND;
// @ts-ignore
const backendPort = process.env.REACT_APP_PORT_BACKEND;

export const api = axios.create({
  baseURL: `http://${backendHost}:${backendPort}`,
  withCredentials: true,
});