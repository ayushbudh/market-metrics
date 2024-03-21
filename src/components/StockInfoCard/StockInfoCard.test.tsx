import { render, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom'
import StockInfoCard from '../StockInfoCard/StockInfoCard';
import mock from '../../api/mock-adapter';
import { companyOverview } from '../../test/test_data/company_overview';
import { stockQuote } from '../../test/test_data/stock_quote';
import axiosInstance from '../../api/axios-instance';

const renderComponent = () => render(<StockInfoCard tickerName="IBM" companyName="International Business Machines" currency="USD" />);

describe('StockInfoCard component test suite', () => {
    beforeAll(() => {
        mock.reset();
    });

    afterEach(() => {
        cleanup();
        mock.reset();
    });

    test('should render component with the correct data', async () => {
        mock.onGet("/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=demo").reply(200, stockQuote);
        mock.onGet("/query?function=OVERVIEW&symbol=IBM&apikey=demo").reply(200, companyOverview);

        const { queryByText, getByTestId } = renderComponent();
        expect(queryByText(/Company Information not found/i)).not.toBeInTheDocument();
        expect(queryByText(/Quote not found/i)).not.toBeInTheDocument();

        await waitFor(async () => {
            expect(getByTestId('stock-quote-sk1')).toBeInTheDocument();
            expect(getByTestId('company-info-sk-grp1')).toBeInTheDocument();

            const companyOverviewActual = await axiosInstance.get("/query?function=OVERVIEW&symbol=IBM&apikey=demo");
            const stockQuoteActual = await axiosInstance.get("/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=demo");
            expect({
                description: companyOverviewActual.data["Description"],
                revenuePerShareTTM: companyOverviewActual.data["RevenuePerShareTTM"],
                EPS: companyOverviewActual.data["EPS"],
                PERatio: companyOverviewActual.data["PERatio"],
                marketCap: companyOverviewActual.data["MarketCapitalization"],
                analystTargetPrice: companyOverviewActual.data["AnalystTargetPrice"],
                fiftyTwoWeekRange: companyOverviewActual.data["52WeekLow"] + " - " + companyOverviewActual.data["52WeekHigh"]
            }).toStrictEqual({
                description: companyOverview["Description"],
                revenuePerShareTTM: companyOverview["RevenuePerShareTTM"],
                EPS: companyOverview["EPS"],
                PERatio: companyOverview["PERatio"],
                marketCap: companyOverview["MarketCapitalization"],
                analystTargetPrice: companyOverview["AnalystTargetPrice"],
                fiftyTwoWeekRange: companyOverview["52WeekLow"] + " - " + companyOverview["52WeekHigh"]
            });

            expect({
                price: stockQuoteActual.data["Global Quote"]["05. price"],
                change: stockQuoteActual.data["Global Quote"]["09. change"],
                changePercent: stockQuoteActual.data["Global Quote"]["10. change percent"]
            }).toStrictEqual({
                price: stockQuote["Global Quote"]["05. price"],
                change: stockQuote["Global Quote"]["09. change"],
                changePercent: stockQuote["Global Quote"]["10. change percent"]
            });
        });

        expect(queryByText(/Quote not found/i)).not.toBeInTheDocument();
        expect(queryByText(/Company Information not found/i)).not.toBeInTheDocument();

    });

    test("should render loading followed by error message for getCompanyOverview API call", async () => {

        mock.onGet("/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=demo").reply(200, stockQuote);
        mock.onGet("/query?function=OVERVIEW&symbol=IBM&apikey=demo").networkError();

        const { queryByText, getByTestId } = renderComponent();
        expect(queryByText(/Quote not found/i)).not.toBeInTheDocument();
        expect(queryByText(/Company Information not found/i)).not.toBeInTheDocument();

        await waitFor(async () => {
            const stockQuoteActual = await axiosInstance.get("/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=demo");
            expect({
                price: stockQuoteActual.data["Global Quote"]["05. price"],
                change: stockQuoteActual.data["Global Quote"]["09. change"],
                changePercent: stockQuoteActual.data["Global Quote"]["10. change percent"]
            }).toStrictEqual({
                price: stockQuote["Global Quote"]["05. price"],
                change: stockQuote["Global Quote"]["09. change"],
                changePercent: stockQuote["Global Quote"]["10. change percent"]
            });
            expect(getByTestId('stock-quote-sk1')).toBeInTheDocument();
            expect(getByTestId('company-info-sk-grp1')).toBeInTheDocument();
        });

        expect(queryByText(/Quote not found/i)).not.toBeInTheDocument();
        expect(queryByText(/Company Information not found/i)).toBeInTheDocument();
    });

    test("should render loading followed by error message for getStockQuote API call", async () => {

        mock.onGet("/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=demo").networkError();
        mock.onGet("/query?function=OVERVIEW&symbol=IBM&apikey=demo").reply(200, companyOverview);

        const { queryByText, getByTestId } = renderComponent();
        expect(queryByText(/Quote not found/i)).not.toBeInTheDocument();
        expect(queryByText(/Company Information not found/i)).not.toBeInTheDocument();

        await waitFor(async () => {
            const companyOverviewActual = await axiosInstance.get("/query?function=OVERVIEW&symbol=IBM&apikey=demo");
            expect({
                description: companyOverviewActual.data["Description"],
                revenuePerShareTTM: companyOverviewActual.data["RevenuePerShareTTM"],
                EPS: companyOverviewActual.data["EPS"],
                PERatio: companyOverviewActual.data["PERatio"],
                marketCap: companyOverviewActual.data["MarketCapitalization"],
                analystTargetPrice: companyOverviewActual.data["AnalystTargetPrice"],
                fiftyTwoWeekRange: companyOverviewActual.data["52WeekLow"] + " - " + companyOverviewActual.data["52WeekHigh"]
            }).toStrictEqual({
                description: companyOverview["Description"],
                revenuePerShareTTM: companyOverview["RevenuePerShareTTM"],
                EPS: companyOverview["EPS"],
                PERatio: companyOverview["PERatio"],
                marketCap: companyOverview["MarketCapitalization"],
                analystTargetPrice: companyOverview["AnalystTargetPrice"],
                fiftyTwoWeekRange: companyOverview["52WeekLow"] + " - " + companyOverview["52WeekHigh"]
            });
            expect(getByTestId('stock-quote-sk1')).toBeInTheDocument();
            expect(getByTestId('company-info-sk-grp1')).toBeInTheDocument();
        });

        expect(queryByText(/Quote not found/i)).toBeInTheDocument();
        expect(queryByText(/Company Information not found/i)).not.toBeInTheDocument();
    });

    test("should render loading followed by error message for getCompanyOverview and getStockQuote API calls", async () => {
        mock.onGet("/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=demo").networkError();
        mock.onGet("/query?function=OVERVIEW&symbol=IBM&apikey=demo").networkError();

        const { queryByText, getByTestId } = renderComponent();
        expect(queryByText(/Quote not found/i)).not.toBeInTheDocument();
        expect(queryByText(/Company Information not found/i)).not.toBeInTheDocument();

        await waitFor(() => {
            expect(getByTestId('stock-quote-sk1')).toBeInTheDocument();
            expect(getByTestId('company-info-sk-grp1')).toBeInTheDocument();
        });

        expect(queryByText(/Quote not found/i)).toBeInTheDocument();
        expect(queryByText(/Company Information not found/i)).toBeInTheDocument();
    });
});