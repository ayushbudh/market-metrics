import { render, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import MarketSentimentChart from './MarketSentimentChart';
import axiosInstance from '../../api/axios-instance';
import mock from '../../api/mock-adapter';
import { marketSentiment } from '../../test/test_data/market_sentiment';
import Sentiment from '../../types/Sentiment';
import StockSentiment from '../../types/StockSentiment';

const renderComponent = () => render(<MarketSentimentChart tickerName="AAPL" />);

describe('MarketSentimentChart test suite', () => {

    beforeAll(() => {
        mock.reset();
    });

    afterEach(cleanup);

    test('should render MarketSentimentChart component with the correct data', async () => {

        mock.onGet("/query?function=NEWS_SENTIMENT&tickers=AAPL&apikey=demo").reply(200, marketSentiment);

        const { queryByText } = renderComponent();
        expect(queryByText(/Loading/i)).toBeInTheDocument();
        expect(queryByText(/Error:/i)).not.toBeInTheDocument();

        await waitFor(async () => {
            const plotElement: any = document.querySelector('.js-plotly-plot');
            const expectedSentiment: StockSentiment = { 'Bearish': 0, 'Somewhat-Bearish': 0, 'Neutral': 0, 'Somewhat_Bullish': 0, 'Bullish': 0 };
            const actualSentiment: StockSentiment = { 'Bearish': 0, 'Somewhat-Bearish': 0, 'Neutral': 0, 'Somewhat_Bullish': 0, 'Bullish': 0 };
            const sentiment = await axiosInstance.get("/query?function=NEWS_SENTIMENT&tickers=AAPL&apikey=demo");
            sentiment.data['feed'].map((feed: { ticker_sentiment: Array<Sentiment> }) => {
                const filteredFeed = feed.ticker_sentiment.filter((sentiment: { ticker: string }) => sentiment.ticker === 'AAPL');
                for (const ffeed of filteredFeed) {
                    if (ffeed.ticker_sentiment_label) {
                        actualSentiment[ffeed.ticker_sentiment_label] += 1
                    }
                }
            })

            marketSentiment['feed'].map((feed: { ticker_sentiment: Array<Sentiment> }) => {
                const filteredFeed = feed.ticker_sentiment.filter((sentiment: { ticker: string }) => sentiment.ticker === 'AAPL');
                for (const ffeed of filteredFeed) {
                    if (ffeed.ticker_sentiment_label) {
                        expectedSentiment[ffeed.ticker_sentiment_label] += 1
                    }
                }
            })
            expect(expectedSentiment).toStrictEqual(actualSentiment);
            expect(plotElement).toBeInTheDocument();
        });
        expect(queryByText(/Loading/i)).not.toBeInTheDocument();
        expect(queryByText(/Error:/i)).not.toBeInTheDocument();
    })

    test("should render loading followed by error message", async () => {

        mock.onGet("/query?function=NEWS_SENTIMENT&tickers=AAPL&apikey=demo").networkError();

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
