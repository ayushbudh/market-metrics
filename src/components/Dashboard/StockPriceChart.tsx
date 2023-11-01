import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Plot from 'react-plotly.js';
import { useState, useEffect } from 'react';
import { getStockGraphTimeSeriesData } from '../../api/stock';


interface StockTimeSeriesData {
    openPrice: string[];
    closePrice: string[];
    dateTime: string[];
}

const StockPriceChart = ({ tickerName, currency }: { tickerName: string, currency: string }) => {
    const [stockTimeSeriesData, setStockTimeSeriesData] = useState<StockTimeSeriesData>({ openPrice: [], closePrice: [], dateTime: [] });

    useEffect(() => {
        getStockGraphTimeSeriesData('IBM')
            .then((res) => {
                const timeSeriesData = res.data["Time Series (5min)"];
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
            .catch((error) => { })
    }, [tickerName]);

    return (
        <Card>
            <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
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
                />
            </CardContent>
        </Card>
    );
}

export default StockPriceChart;