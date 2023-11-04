import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Plot from 'react-plotly.js';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ErrorIcon from '@mui/icons-material/Error';
import { CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import { getStockGraphTimeSeriesData } from '../../api/stock';


interface StockTimeSeriesData {
    openPrice: string[];
    closePrice: string[];
    dateTime: string[];
}

const StockPriceChart = ({ tickerName, currency }: { tickerName: string, currency: string }) => {
    const [stockTimeSeriesData, setStockTimeSeriesData] = useState<StockTimeSeriesData>({ openPrice: [], closePrice: [], dateTime: [] });
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        getStockGraphTimeSeriesData('IBM')
            .then((stockData) => {
                if (stockData.data['Time Series (5min)'] === undefined) throw new Error("Stock price data not found from the API");
                if (stockData.data['Time Series (5min)'].length === 0) throw new Error("Stock price data unavailable for this ticker");
                const timeSeriesData = stockData.data["Time Series (5min)"];
                const openPrice: string[] = [];
                const closePrice: string[] = [];
                const dateTime: string[] = [];
                for (const dt in timeSeriesData) {
                    openPrice.push(timeSeriesData[dt]["1. open"]);
                    closePrice.push(timeSeriesData[dt]["4. close"]);
                    dateTime.push(dt);
                }
                setStockTimeSeriesData({ openPrice, closePrice, dateTime });
            })
            .catch((error) => { setError(error.message); })
            .finally(() => { setIsLoading(false); })
    }, [tickerName]);

    return (
        <Card>
            <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 450 }}>
                {isLoading ?
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <CircularProgress size={30} />
                        <Typography variant='h6'>Loading</Typography>
                    </Box> :
                    error.length !== 0 ?
                        <Box textAlign={'center'}>
                            <ErrorIcon color={'error'} fontSize='large' />
                            <Typography variant='h6'>Error: {error}</Typography>
                        </Box> :
                        <Plot
                            data={[
                                {
                                    x: stockTimeSeriesData.dateTime, y: stockTimeSeriesData.openPrice,
                                    type: 'scatter',
                                    mode: 'lines+markers',
                                    name: 'Open'
                                },
                                {
                                    x: stockTimeSeriesData.dateTime, y: stockTimeSeriesData.closePrice,
                                    type: 'scatter',
                                    mode: 'lines+markers',
                                    name: 'Close'
                                },
                            ]}
                            layout={
                                {
                                    xaxis: {
                                        title: { font: { family: 'Courier New, monospace', size: 18 } },
                                        autorange: true,
                                        range: ['2015-02-17', '2017-02-16'],
                                        rangeselector: {
                                            buttons: [
                                                {
                                                    count: 1,
                                                    label: '1m',
                                                    step: 'month',
                                                    stepmode: 'backward'
                                                },
                                                {
                                                    count: 3,
                                                    label: '3m',
                                                    step: 'month',
                                                    stepmode: 'backward'
                                                },
                                                {
                                                    count: 6,
                                                    label: '6m',
                                                    step: 'month',
                                                    stepmode: 'backward'
                                                },
                                                { step: 'all' }
                                            ]
                                        },
                                        type: 'date'
                                    },
                                    yaxis: { title: { text: `Price (in ${currency})`, font: { family: 'Courier New, monospace', size: 18 } } },
                                }
                            }
                        />}
            </CardContent>
        </Card>
    );
}

export default StockPriceChart;