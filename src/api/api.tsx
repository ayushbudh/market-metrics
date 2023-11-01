import axios from 'axios';

const alphavantageBaseURL = axios.create({
    baseURL: 'https://www.alphavantage.co'
});

export default alphavantageBaseURL;