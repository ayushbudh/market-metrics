import { render, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import StockPriceChart from './StockPriceChart';
import axiosInstance from '../../api/axios-instance';
import mock from '../../api/mock-adapter';
import { timeSeriesData } from '../../test/test_data/time_series_data';
import StockTimeSeriesData from '../../types/StockTimeSeriesData';

const renderComponent = () => render(<StockPriceChart tickerName="IBM" currency="USD" />);

describe('StockPriceChart component test suite', () => {
    beforeAll(() => {
        mock.reset();
    });

    afterEach(() => {
        cleanup();
        mock.reset();
    });

    test('should render component with the correct data', async () => {
        mock.onGet("/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo").reply(200, timeSeriesData);

        const { queryByText } = renderComponent();
        expect(queryByText(/Loading/i)).toBeInTheDocument();
        expect(queryByText(/Error:/i)).not.toBeInTheDocument();

        await waitFor(async () => {
            const plotElement: any = document.querySelector('.js-plotly-plot');
            const actualXValuesForLegend1: string[] = plotElement['_fullData'][0]['_input']['x'];
            const actualYValuesForLegend1: string[] = plotElement['_fullData'][0]['_input']['y'];
            const actualXValuesForLegend2: string[] = plotElement['_fullData'][1]['_input']['x'];
            const actualYValuesForLegend2: string[] = plotElement['_fullData'][1]['_input']['y'];
            const stockData = await axiosInstance.get("/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo");
            const timeSeriesData = stockData.data["Time Series (5min)"];
            const stockTimeSeriesData: StockTimeSeriesData = {
                openPrice: [],
                closePrice: [],
                dateTime: []
            };
            for (const dt in timeSeriesData) {
                stockTimeSeriesData.openPrice.push(timeSeriesData[dt]["1. open"]);
                stockTimeSeriesData.closePrice.push(timeSeriesData[dt]["4. close"]);
                stockTimeSeriesData.dateTime.push(dt);
            }
            expect(actualYValuesForLegend1).toStrictEqual(stockTimeSeriesData.openPrice);
            expect(actualYValuesForLegend2).toStrictEqual(stockTimeSeriesData.closePrice);
            expect(actualXValuesForLegend1).toStrictEqual(stockTimeSeriesData.dateTime);
            expect(actualXValuesForLegend2).toStrictEqual(stockTimeSeriesData.dateTime);
            expect(plotElement).toBeInTheDocument();
        });
        expect(queryByText(/Loading/i)).not.toBeInTheDocument();
        expect(queryByText(/Error:/i)).not.toBeInTheDocument();
    });

    test("should render loading followed by error message for getStockGraphTimeSeriesData API call", async () => {
        mock.onGet("/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo").networkError();

        const { queryByText } = renderComponent();
        expect(queryByText(/Loading/i)).toBeInTheDocument();
        expect(queryByText(/Error:/i)).not.toBeInTheDocument();

        await waitFor(() => {
            expect(queryByText(/Loading/i)).toBeInTheDocument();
        });

        expect(queryByText(/Loading/i)).not.toBeInTheDocument();
        expect(queryByText(/Error:/i)).toBeInTheDocument();
    });
});