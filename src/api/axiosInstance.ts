import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://wanderplan-ai-back.vercel.app',
    withCredentials: true,
});

export default axiosInstance;