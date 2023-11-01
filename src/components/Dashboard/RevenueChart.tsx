import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Plot from 'react-plotly.js';
import { CircularProgress } from '@mui/material';
import { useState, useEffect } from "react";
import { getIncomeStatement } from "../../api/stock";

interface IncomeReport {
    reportedCurrency: string;
    totalRevenue: string[];
    fiscalDateEnding: string[];
}

const RevenueChart = ({ tickerName }: { tickerName: string }) => {
    const [companyAnnualReport, setCompanyAnnualReport] = useState<IncomeReport>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        getIncomeStatement(tickerName)
            .then((statement) => {
                const annualReport: IncomeReport = { reportedCurrency: '', totalRevenue: [], fiscalDateEnding: [] }
                statement.data['annualReports'].map((report: any) => {
                    annualReport.totalRevenue.push(report.totalRevenue);
                    annualReport.fiscalDateEnding.push(report.fiscalDateEnding);
                    annualReport.reportedCurrency = report.reportedCurrency
                })
                setCompanyAnnualReport(annualReport);
            })
            .catch((error) => { })
            .finally(() => { setIsLoading(false); })
    }, [tickerName])

    return (
        <Card>
            <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
                {isLoading ? <CircularProgress /> : <Plot
                    data={[
                        {
                            x: companyAnnualReport?.fiscalDateEnding,
                            y: companyAnnualReport?.totalRevenue,
                            type: 'scatter',
                            mode: 'lines+markers',
                            name: 'Open'
                        }
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
                            yaxis: { title: { text: `Revenue (in ${companyAnnualReport?.reportedCurrency})`, font: { family: 'Courier New, monospace', size: 18 } } },
                        }
                    }
                />}
            </CardContent>
        </Card>
    );
}

export default RevenueChart;