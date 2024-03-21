import { render, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom'
import RevenueChart from '../RevenueChart/RevenueChart';
import axiosInstance from '../../api/axios-instance';
import mock from '../../api/mock-adapter';
import { incomeStatement } from '../../test/test_data/income_statement';

const renderComponent = () => render(<RevenueChart tickerName="AAPL" />);

describe('RevenueChart component test suite', () => {
    beforeAll(() => {
        mock.reset();
    });

    afterEach(() => {
        cleanup();
        mock.reset();
    });

    test('should render component with the correct data', async () => {
        mock.onGet("/query?function=INCOME_STATEMENT&symbol=IBM&apikey=demo").reply(200, incomeStatement);

        const { queryByText } = renderComponent();
        expect(queryByText(/Loading/i)).toBeInTheDocument();
        expect(queryByText(/Error:/i)).not.toBeInTheDocument();

        await waitFor(() => {
            const plotElement: any = document.querySelector('.js-plotly-plot');
            const actualXValues: string[] = plotElement['_fullData'][0]['_input']['x'];
            const actualYValues: string[] = plotElement['_fullData'][0]['_input']['y'];

            axiosInstance
                .get("/query?function=INCOME_STATEMENT&symbol=IBM&apikey=demo")
                .then(function (statement: any) {
                    const expectedXValues: string[] = []
                    const expectedYValues: string[] = []
                    statement.data['annualReports'].map((report: any) => {
                        expectedXValues.push(report.fiscalDateEnding);
                        expectedYValues.push(report.totalRevenue);
                    });
                    expect(actualXValues).toStrictEqual(expectedXValues);
                    expect(actualYValues).toStrictEqual(expectedYValues);
                })

            expect(plotElement).toBeInTheDocument();
        });

        expect(queryByText(/Loading/i)).not.toBeInTheDocument();
        expect(queryByText(/Error:/i)).not.toBeInTheDocument();
    });

    test("should render loading followed by error message for getIncomeStatement API call", async () => {
        mock.onGet("/query?function=INCOME_STATEMENT&symbol=IBM&apikey=demo").networkError();

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
