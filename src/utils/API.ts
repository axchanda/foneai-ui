import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:4000',
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
