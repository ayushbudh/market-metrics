import { useState, Fragment } from "react";
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import StockInfoCard from './StockInfoCard';
import StockPriceChart from './StockPriceChart';
import { getStockSearchResults } from "../../api/api";
import FinancialMetrics from "./FinancialMetrics";
import SearchResult from "../../types/SearchResult";

const Dashboard = () => {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<readonly SearchResult[]>([]);
    const [selectedStock, setSelectedStock] = useState<SearchResult>({ companyName: '', tickerName: '', currency: '' });
    const [searchResultsLoading, setSearchResultsLoading] = useState<boolean>(false);

    const setSearchResults = (query: string) => {
        setSearchResultsLoading(true);
        if (query.length === 0) {
            setOptions([]);
            setSearchResultsLoading(false);
            return;
        }
        getStockSearchResults(query)
            .then((res) => {
                if (res.data && res.data['bestMatches']) {
                    setOptions(res.data.bestMatches.map((e: any) => {
                        return {
                            tickerName: e["1. symbol"],
                            companyName: e["2. name"],
                            currency: e["8. currency"]
                        }
                    }));
                }
            })
            .catch((error) => { })
            .finally(() => { setSearchResultsLoading(false); })
    }

    return (
        <Grid container spacing={2} mt={8} ml={6} mr={6}>
            <Grid xs={12}>
                <Autocomplete
                    noOptionsText="No stocks"
                    onChange={(_, value: SearchResult | null) => {
                        value ? setSelectedStock(value) : setSelectedStock({ tickerName: '', companyName: '', currency: '' })
                    }}
                    onInputChange={(_, query) => {
                        setSearchResults(query);
                    }}
                    open={open}
                    onOpen={() => {
                        setOpen(true);
                    }}
                    onClose={() => {
                        setOpen(false);
                    }}
                    renderOption={(props, option) => {
                        return (
                            <li {...props}>
                                <Grid container alignItems="center">
                                    <Grid>
                                        <Typography variant="body1" color="text.primary">
                                            {option.tickerName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {option.companyName}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </li>)
                    }}
                    isOptionEqualToValue={(option, value) => {
                        return option.companyName === value.companyName || option.tickerName === value.tickerName
                    }}
                    getOptionLabel={(option) => option.tickerName + ' (' + option.companyName + ')'}
                    options={options}
                    loading={searchResultsLoading}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Search stock tickers, company names ..."
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <Fragment>
                                        {searchResultsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </Fragment>
                                ),
                            }}
                            variant="standard"
                        />
                    )}
                />
            </Grid>
            {selectedStock.tickerName === '' ? (
                <>
                    <Grid xs={12}>
                        <Typography textAlign={'center'}> Please search and select a stock to see its details.</Typography>
                    </Grid>
                </>
            ) : (<>
                <Grid xs={12} md={12} lg={4.5}>
                    <StockInfoCard
                        tickerName={selectedStock.tickerName}
                        companyName={selectedStock.companyName}
                        currency={selectedStock.currency}
                    />
                </Grid>
                <Grid xs={12} md={12} lg={7.5}>
                    <StockPriceChart tickerName={selectedStock.tickerName} currency={selectedStock.currency} />
                </Grid>
                <Grid xs={12}>
                    <FinancialMetrics tickerName={selectedStock.tickerName} />
                </Grid>
            </>)
            }
        </Grid >
    )
}
export default Dashboard;