import axios from 'axios';

const API = axios.create({
  // baseURL: 'http://localhost:4000',
  baseURL: 'https://bbxaulogg4cfrdzpheaislkkfe0wafen.lambda-url.us-east-2.on.aws'
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
