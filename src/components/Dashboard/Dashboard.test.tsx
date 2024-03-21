import { render, waitFor, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'
import Dashboard from './Dashboard';
import mock from '../../api/mock-adapter';
import { searchResults } from '../../test/test_data/search_results';
import axiosInstance from '../../api/axios-instance';

const renderComponent = () => render(<Dashboard />);

describe('Dashboard component test suite', () => {
    beforeAll(() => {
        mock.reset();
    });

    afterEach(() => {
        cleanup();
        mock.reset();
    });

    test('should render component with the correct data', async () => {
        mock.onGet("/query?function=SYMBOL_SEARCH&keywords=BA&apikey=demo").reply(200, searchResults);

        const { queryByText, getByLabelText } = renderComponent();
        fireEvent.change(getByLabelText(/Search stock tickers, company names .../i), { target: { value: 'BA' } })
        expect(queryByText(/No stocks found. Please fix your search query!/i)).toBeInTheDocument();

        await waitFor(async () => {
            const searchResults = await axiosInstance.get('/query?function=SYMBOL_SEARCH&keywords=BA&apikey=demo');
            for (const searchResult of searchResults.data["bestMatches"]) {
                const companyName = searchResult["2. name"];
                const ticker = searchResult["1. symbol"];
                expect(queryByText(new RegExp(`^${ticker}$`))).toBeInTheDocument();
                expect(queryByText(new RegExp(`^${companyName}$`))).toBeInTheDocument();
            }
        });

        expect(queryByText(/No stocks found. Please fix your search query!/i)).not.toBeInTheDocument();
    });

    test("should render component followed by error message for getStockSearchResults API call", async () => {
        mock.onGet("/query?function=SYMBOL_SEARCH&keywords=BA&apikey=demo").networkError();

        const { queryByText, getByLabelText } = renderComponent();
        fireEvent.change(getByLabelText(/Search stock tickers, company names .../i), { target: { value: 'BA' } })
        expect(queryByText(/Something went wrong. Please try again later./i)).not.toBeInTheDocument();

        await waitFor(() => {
            expect(queryByText(/No stocks found. Please fix your search query!/i)).toBeInTheDocument();
        });

        expect(queryByText(/Something went wrong. Please try again later./i)).toBeInTheDocument();
    });
});