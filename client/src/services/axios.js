import axios from 'axios';
import { config } from '@/config';

const axiosInstance = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((requestConfig) => {
  // Future: attach authentication token when auth is implemented
  return requestConfig;
});

export default axiosInstance;
