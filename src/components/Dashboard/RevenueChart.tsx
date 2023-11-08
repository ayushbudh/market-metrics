import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Plot from 'react-plotly.js';
import 'react-plotly.js'
import { CircularProgress } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from "react";
import { getIncomeStatement } from "../../api/api";
import IncomeReport from '../../types/IncomeReport';

const RevenueChart = ({ tickerName }: { tickerName: string }) => {
    const [companyAnnualReport, setCompanyAnnualReport] = useState<IncomeReport>();
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        getIncomeStatement(tickerName)
            .then((statement) => {
                const annualReport: IncomeReport = {
                    reportedCurrency: '',
                    totalRevenue: [],
                    fiscalDateEnding: []
                };
                if (statement.data['annualReports'] === undefined) {
                    throw new Error("Annual revenue data not found from the API");
                }
                if (statement.data['annualReports'].length === 0) {
                    throw new Error("Annual revenue data unavailable for this ticker");
                }
                statement.data['annualReports'].forEach((report: any) => {
                    annualReport.totalRevenue.push(report.totalRevenue);
                    annualReport.fiscalDateEnding.push(report.fiscalDateEnding);
                    annualReport.reportedCurrency = report.reportedCurrency
                });
                setCompanyAnnualReport(annualReport);
            })
            .catch((error) => {
                setError(error.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [tickerName]);

    return (
        <Card>
            <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 450 }}>
                {isLoading ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <CircularProgress size={30} />
                        <Typography variant='h6'>Loading</Typography>
                    </Box>
                ) : error.length != 0 ? (
                    <Box textAlign={'center'}>
                        <ErrorIcon color={'error'} fontSize='large' />
                        <Typography variant='h6'>Error: {error}</Typography>
                    </Box>
                ) : (
                    <Plot
                        data={[
                            {
                                x: companyAnnualReport?.fiscalDateEnding,
                                y: companyAnnualReport?.totalRevenue,
                                type: 'scatter',
                                mode: 'lines+markers',
                                name: 'Open'
                            }
                        ]}
                        layout={{
                            xaxis: {
                                title: { font: { family: 'Courier New, monospace', size: 18 } },
                                autorange: true,
                                range: ['2018-12-30', '2023-12-30'],
                                rangeselector: {
                                    buttons: [
                                        {
                                            count: 1,
                                            label: '1y',
                                            step: 'year',
                                            stepmode: 'backward'
                                        },
                                        {
                                            count: 3,
                                            label: '3y',
                                            step: 'year',
                                            stepmode: 'backward'
                                        },
                                        { step: 'all' }
                                    ]
                                },
                                type: 'date'
                            },
                            yaxis: {
                                title: {
                                    text: `Revenue (in ${companyAnnualReport?.reportedCurrency})`,
                                    font: {
                                        family: 'Courier New, monospace',
                                        size: 18
                                    }
                                },
                            },
                        }}
                    />
                )}
            </CardContent>
        </Card>
    );
}

export default RevenueChart;