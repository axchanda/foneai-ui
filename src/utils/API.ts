import axios from 'axios';
import { CONFIG } from 'src/config-global';

const API = axios.create({
  baseURL: CONFIG.backendURL
});

API.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${sessionStorage.getItem('jwt_access_token')}`;
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
