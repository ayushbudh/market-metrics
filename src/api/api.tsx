import axiosInstance from "./axios-instance";

const ALPHAVANTAGE_API_KEY: string = import.meta.env.VITE_ALPHAVANTAGE_API_KEY;
const ISPRODUCTION: string = import.meta.env.VITE_ISPRODUCTION;

export const getStockGraphTimeSeriesData = (ticker: string) => {
    const query = `/query?function=TIME_SERIES_INTRADAY&symbol=${ISPRODUCTION === 'true' ? ticker : 'IBM'}&interval=5min&apikey=${ISPRODUCTION === 'true' ? ALPHAVANTAGE_API_KEY : 'demo'}`;
    return axiosInstance.get(query);
}

export const getStockSearchResults = (keywords: string) => {
    const query = `/query?function=SYMBOL_SEARCH&keywords=${keywords.toUpperCase()}&apikey=${ISPRODUCTION === 'true' ? ALPHAVANTAGE_API_KEY : 'demo'}`;
    return axiosInstance.get(query);
}

export const getStockQuote = (ticker: string) => {
    const query = `/query?function=GLOBAL_QUOTE&symbol=${ISPRODUCTION === 'true' ? ticker : 'IBM'}&apikey=${ISPRODUCTION === 'true' ? ALPHAVANTAGE_API_KEY : 'demo'}`;
    return axiosInstance.get(query);
}

export const getMarketSentiment = (ticker: string) => {
    const query = `/query?function=NEWS_SENTIMENT&tickers=${ISPRODUCTION === 'true' ? ticker : 'AAPL'}&apikey=${ISPRODUCTION === 'true' ? ALPHAVANTAGE_API_KEY : 'demo'}`;
    return axiosInstance.get(query);
}

export const getCompanyOverview = (ticker: string) => {
    const query = `/query?function=OVERVIEW&symbol=${ISPRODUCTION === 'true' ? ticker : 'IBM'}&apikey=${ISPRODUCTION === 'true' ? ALPHAVANTAGE_API_KEY : 'demo'}`;
    return axiosInstance.get(query);
}

export const getIncomeStatement = (ticker: string) => {
    const query = `/query?function=INCOME_STATEMENT&symbol=${ISPRODUCTION === 'true' ? ticker : 'IBM'}&apikey=${ISPRODUCTION === 'true' ? ALPHAVANTAGE_API_KEY : 'demo'}`;
    return axiosInstance.get(query);
}