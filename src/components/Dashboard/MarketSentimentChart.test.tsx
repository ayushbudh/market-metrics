import { render, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import MarketSentimentChart from './MarketSentimentChart';
import axiosInstance from '../../api/axios-instance';
import mock from '../../api/mock-adapter';
import { marketSentiment } from '../../test/test_data/market_sentiment';
import Sentiment from '../../types/Sentiment';
import SentimentShare from '../../types/SentimentShare';

const renderComponent = () => render(<MarketSentimentChart tickerName="AAPL" />);

describe('MarketSentimentChart component test suite', () => {
    beforeAll(() => {
        mock.reset();
    });

    afterEach(() => {
        cleanup();
        mock.reset();
    });

    test('should render component with the correct data', async () => {
        mock.onGet("/query?function=NEWS_SENTIMENT&tickers=AAPL&apikey=demo").reply(200, marketSentiment);

        const { queryByText } = renderComponent();
        expect(queryByText(/Loading/i)).toBeInTheDocument();
        expect(queryByText(/Error:/i)).not.toBeInTheDocument();

        await waitFor(async () => {
            const plotElement: any = document.querySelector('.js-plotly-plot');
            const expectedSentimentCount: SentimentShare = { 'bearish': 0, 'somewhatBearish': 0, 'neutral': 0, 'somewhatBullish': 0, 'bullish': 0 };
            const actualSentimentCount: SentimentShare = { 'bearish': 0, 'somewhatBearish': 0, 'neutral': 0, 'somewhatBullish': 0, 'bullish': 0 };
            const sentiment = await axiosInstance.get("/query?function=NEWS_SENTIMENT&tickers=AAPL&apikey=demo");

            sentiment.data['feed'].forEach((feed: { ticker_sentiment: Array<Sentiment> }) => {
                const filteredFeed = feed.ticker_sentiment.filter((sentiment: { ticker: string }) => sentiment.ticker === 'AAPL');
                for (const ffeed of filteredFeed) {
                    if (ffeed.ticker_sentiment_label) {
                        switch (ffeed.ticker_sentiment_label) {
                            case 'Bearish': actualSentimentCount.bearish += 1; break;
                            case 'Somewhat-Bearish': actualSentimentCount.somewhatBearish += 1; break;
                            case 'Neutral': actualSentimentCount.neutral += 1; break;
                            case 'Somewhat_Bullish': actualSentimentCount.somewhatBullish += 1; break;
                            case 'Bullish': actualSentimentCount.bullish += 1; break;
                        }
                    }
                }
            });

            sentiment.data['feed'].forEach((feed: { ticker_sentiment: Array<Sentiment> }) => {
                const filteredFeed = feed.ticker_sentiment.filter((sentiment: { ticker: string }) => sentiment.ticker === 'AAPL');
                for (const ffeed of filteredFeed) {
                    if (ffeed.ticker_sentiment_label) {
                        switch (ffeed.ticker_sentiment_label) {
                            case 'Bearish': expectedSentimentCount.bearish += 1; break;
                            case 'Somewhat-Bearish': expectedSentimentCount.somewhatBearish += 1; break;
                            case 'Neutral': expectedSentimentCount.neutral += 1; break;
                            case 'Somewhat_Bullish': expectedSentimentCount.somewhatBullish += 1; break;
                            case 'Bullish': expectedSentimentCount.bullish += 1; break;
                        }
                    }
                }
            });
            expect(expectedSentimentCount).toStrictEqual(actualSentimentCount);
            expect(plotElement).toBeInTheDocument();
        });
        expect(queryByText(/Loading/i)).not.toBeInTheDocument();
        expect(queryByText(/Error:/i)).not.toBeInTheDocument();
    });

    test("should render loading followed by error message for getMarketSentiment API call", async () => {
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
