import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://www.alphavantage.co'
});

export default axiosInstance;