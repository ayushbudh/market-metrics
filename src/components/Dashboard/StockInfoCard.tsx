import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ErrorIcon from '@mui/icons-material/Error';
import { useEffect, useState } from "react";
import Skeleton from '@mui/material/Skeleton';
import { getStockQuote, getCompanyOverview } from '../../api/api';
import Divider from '@mui/material/Divider';
import CompanyMetrics from '../../types/CompanyMetrics';
import InfoCardProps from '../../types/InfoCardProps';
import StockQuote from '../../types/StockQuote';

const StockInfoCard = ({ tickerName, companyName, currency }: InfoCardProps) => {
    const [stockQuote, setStockQuote] = useState<StockQuote>({ price: '', change: '', changePercent: '' });
    const [companyInfo, setCompanyInfo] = useState<CompanyMetrics>({ description: '', revenuePerShareTTM: '', EPS: '', PERatio: '', marketCap: '', analystTargetPrice: '', fiftyTwoWeekRange: '' });
    const [value, setValue] = useState('1');
    const [isStockQuoteError, setIsStockQuoteError] = useState<string>("");
    const [isCompanyInfoError, setIsCompanyInfoError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const handleChange = (_: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1) + 'B';
        } else if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else {
            return num.toString();
        }
    };

    useEffect(() => {
        getCompanyOverview(tickerName)
            .then((companyInfo) => {
                if (companyInfo.data["Description"] === undefined) throw new Error("Company information not found from the API");
                setCompanyInfo({
                    description: companyInfo.data["Description"],
                    revenuePerShareTTM: companyInfo.data["RevenuePerShareTTM"],
                    EPS: companyInfo.data["EPS"],
                    PERatio: companyInfo.data["PERatio"],
                    marketCap: companyInfo.data["MarketCapitalization"],
                    analystTargetPrice: companyInfo.data["AnalystTargetPrice"],
                    fiftyTwoWeekRange: companyInfo.data["52WeekLow"] + " - " + companyInfo.data["52WeekHigh"]
                });
            })
            .catch((error) => { setIsCompanyInfoError(error.message); })
        getStockQuote(tickerName)
            .then((quote) => {
                if (quote.data["Global Quote"] === undefined) throw new Error("Stock quote information not found from the API");
                const quoteData = quote.data["Global Quote"];
                setStockQuote({
                    price: quoteData["05. price"],
                    change: quoteData["09. change"],
                    changePercent: quoteData["10. change percent"]
                });
            })
            .catch((error) => { setIsStockQuoteError(error.message); })
            .finally(() => { setIsLoading(false); })
    }, [tickerName])


    return (
        <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', minHeight: 450 }}>
                <Typography variant="h3">
                    {tickerName}
                </Typography>
                <Typography gutterBottom variant="h5" color="text.secondary">
                    {companyName}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                    {isLoading ? <Skeleton data-testid="stock-quote-sk1" sx={{ fontSize: '2rem' }} width={120} /> :
                        isStockQuoteError.length !== 0 ?
                            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                <ErrorIcon color='error' sx={{ mr: 1 }} />
                                <Typography>Quote not found</Typography>
                            </Box> : <>
                                <Typography variant="h5" color="text.teritary">
                                    {currency} {parseFloat(stockQuote.price).toFixed(2)}
                                </Typography>
                                <Typography variant="h6" color={parseFloat(stockQuote.change) > 0 ? 'green' : 'red'}>
                                    {parseFloat(stockQuote.change).toFixed(2)} ({parseFloat(stockQuote.changePercent.slice(0, -1)).toFixed(2)}%)
                                </Typography>
                            </>}
                </Box>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="Company's data insights">
                            <Tab label="Quick Insights" value="1" />
                            <Tab label="Company Description" value="2" />
                        </TabList>
                    </Box>
                    <TabPanel value="1">
                        {isLoading ?
                            <Grid data-testid="company-info-sk-grp1" container spacing={2} minHeight={160} textAlign={'center'}>
                                <Grid xs={4} display="flex" flexDirection={'column'} alignItems={'center'}>
                                    <Skeleton sx={{ fontSize: '4rem', width: '100%' }} />
                                </Grid>
                                <Grid xs={4} display="flex" flexDirection={'column'} alignItems={'center'}>
                                    <Skeleton sx={{ fontSize: '4rem', width: '100%' }} />
                                </Grid>
                                <Grid xs={4} display="flex" flexDirection={'column'} alignItems={'center'}>
                                    <Skeleton sx={{ fontSize: '4rem', width: '100%' }} />
                                </Grid>
                                <Grid xs={4} display="flex" flexDirection={'column'} alignItems={'center'}>
                                    <Skeleton sx={{ fontSize: '4rem', width: '100%' }} />
                                </Grid>
                                <Grid xs={4} display="flex" flexDirection={'column'} alignItems={'center'}>
                                    <Skeleton sx={{ fontSize: '4rem', width: '100%' }} />
                                </Grid>
                                <Grid xs={4} display="flex" flexDirection={'column'} alignItems={'center'}>
                                    <Skeleton sx={{ fontSize: '4rem', width: '100%' }} />
                                </Grid>
                            </Grid> :
                            isCompanyInfoError.length !== 0 ?
                                <>
                                    <Divider />
                                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} height={'36vh'} width={'32vw'}>
                                        <Divider />
                                        <ErrorIcon color='error' sx={{ mr: 1 }} />
                                        <Typography>Company Information not found</Typography>
                                    </Box>
                                </> :
                                <Grid container spacing={2} minHeight={160} p={4} textAlign={'center'}>
                                    <Grid xs={4} display="flex" flexDirection={'column'} alignItems={'center'}>
                                        <Typography variant='h6'>Revenue per share (TTM)</Typography>
                                        <Typography variant='body1'>{companyInfo.revenuePerShareTTM}</Typography>
                                    </Grid>
                                    <Grid xs={4} display="flex" flexDirection={'column'} alignItems={'center'}>
                                        <Typography variant='h6'>EPS</Typography>
                                        <Typography variant='body1'>{companyInfo.EPS}</Typography>
                                    </Grid>
                                    <Grid xs={4} display="flex" flexDirection={'column'} alignItems={'center'}>
                                        <Typography variant='h6'>PERatio</Typography>
                                        <Typography variant='body1'>{companyInfo.PERatio}</Typography>
                                    </Grid>
                                    <Grid xs={4} display="flex" flexDirection={'column'} alignItems={'center'}>
                                        <Typography variant='h6'>Market Cap</Typography>
                                        <Typography variant='body1'>{formatNumber(parseInt(companyInfo.marketCap))}</Typography>
                                    </Grid>
                                    <Grid xs={4} display="flex" flexDirection={'column'} alignItems={'center'}>
                                        <Typography variant='h6'>Analyst Target Price</Typography>
                                        <Typography variant='body1'>{companyInfo.analystTargetPrice}</Typography>
                                    </Grid>
                                    <Grid xs={4} display="flex" flexDirection={'column'} alignItems={'center'}>
                                        <Typography variant='h6'>52 Week Range</Typography>
                                        <Typography variant='body1'>{companyInfo.fiftyTwoWeekRange}</Typography>
                                    </Grid>
                                </Grid>}
                    </TabPanel>
                    <TabPanel value="2">
                        {isLoading ?
                            <Skeleton sx={{ fontSize: '8.7rem', width: '100%' }} /> :
                            isCompanyInfoError.length !== 0 ?
                                <>
                                    <Divider />
                                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} height={'36vh'} width={'32vw'}>
                                        <Divider />
                                        <ErrorIcon color='error' sx={{ mr: 1 }} />
                                        <Typography>Company Information not found</Typography>
                                    </Box>
                                </> :
                                <Typography variant='body1'>
                                    {companyInfo.description}
                                </Typography>}
                    </TabPanel>
                </TabContext>
            </CardContent>
        </Card>
    );
}

export default StockInfoCard;