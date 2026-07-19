import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://wanderplan-ai-back.vercel.app/api',
  withCredentials: true,
});

export default axiosInstance;
