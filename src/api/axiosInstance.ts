import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: '/api',          // proxy forwards /api → backend
    withCredentials: true,
});

export default axiosInstance;