import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Plot from 'react-plotly.js';
import Box from '@mui/material/Box';
import ErrorIcon from '@mui/icons-material/Error';
import { useEffect, useState } from 'react';
import { getMarketSentiment } from '../../api/api';
import { CircularProgress, Typography } from '@mui/material';
import SentimentShare from '../../types/SentimentShare';
import Sentiment from '../../types/Sentiment';

const MarketSentimentChart = ({ tickerName }: { tickerName: string }) => {
    const [sentimentScores, setSentimentScores] = useState<SentimentShare>({ 'bearish': 0, 'somewhatBearish': 0, 'neutral': 0, 'somewhatBullish': 0, 'bullish': 0 });
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        getMarketSentiment(tickerName)
            .then((sentiment) => {
                let bearish: number = 0;
                let somewhatBearish: number = 0;
                let neutral: number = 0;
                let somewhatBullish: number = 0;
                let bullish: number = 0;

                if (sentiment.data['feed'] === undefined) throw new Error("Market sentiment data not found from the API");
                if (sentiment.data['feed'].length === 0) throw new Error("Market sentiment data unavailable for this ticker");

                sentiment.data['feed'].map((feed: { ticker_sentiment: Array<Sentiment> }) => {
                    const filteredFeed = feed.ticker_sentiment.filter((sentiment: { ticker: string }) => sentiment.ticker === 'AAPL');
                    for (const feed of filteredFeed) {
                        switch (feed.ticker_sentiment_label) {
                            case 'Bearish':
                                bearish += 1
                                break;
                            case 'Somewhat-Bearish':
                                somewhatBearish += 1;
                                break;
                            case 'Neutral':
                                neutral += 1;
                                break;
                            case 'Somewhat_Bullish':
                                somewhatBullish += 1;
                                break;
                            case 'Bullish':
                                bullish += 1;
                                break;
                            default:
                        }
                    }
                })
                setSentimentScores({ bearish, somewhatBearish, neutral, somewhatBullish, bullish });
            })
            .catch((error) => { setError(error.message); })
            .finally(() => { setIsLoading(false); })
    }, [tickerName])

    return (
        <Card>
            <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 450 }} >
                {isLoading ?
                    <Box textAlign={'center'}>
                        <CircularProgress size={30} />
                        <Typography variant='h6'>Loading</Typography>
                    </Box> :
                    error.length != 0 ? <Box textAlign={'center'}>
                        <ErrorIcon color={'error'} fontSize='large' />
                        <Typography variant='h6'>Error: {error}</Typography>
                    </Box> : <Plot
                        data={[
                            {
                                values: [sentimentScores.bearish, sentimentScores.somewhatBearish, sentimentScores.neutral, sentimentScores.somewhatBullish, sentimentScores.bullish],
                                labels: ['Bearish', 'Somewhat-Bearish', 'Neutral', 'Somewhat_Bullish', 'Bullish'],
                                type: 'pie'
                            }
                        ]}
                        layout={{
                            title: 'Market Sentiment Share'
                        }}>
                    </Plot>}
            </CardContent>
        </Card>
    );
}

export default MarketSentimentChart;