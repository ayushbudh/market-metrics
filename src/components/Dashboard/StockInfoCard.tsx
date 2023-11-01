import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useEffect, useState } from "react";
import { getStockQuote } from '../../api/stock';

interface InfoCardProps {
    tickerName: string;
    companyName: string;
    currency: string;
}

interface StockQuote {
    price: string;
    change: string;
    changePercent: string;
}


const StockInfoCard = ({ tickerName, companyName, currency }: InfoCardProps) => {

    const [stockQuote, setStockQuote] = useState<StockQuote>({ price: '', change: '', changePercent: '' });
    const [value, setValue] = useState('1');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    useEffect(() => {
        getStockQuote(tickerName)
            .then((quote) => {
                const quoteData = quote.data["Global Quote"];
                setStockQuote({
                    price: quoteData["05. price"],
                    change: quoteData["09. change"],
                    changePercent: quoteData["10. change percent"]
                });
            })
            .catch((error) => { })
    }, [tickerName])


    return (
        <Card>
            <CardContent sx={{ minHeight: 450 }}>
                <Typography variant="h3">
                    {tickerName}
                </Typography>
                <Typography gutterBottom variant="h5" color="text.secondary">
                    {companyName}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                    <Typography variant="h5" color="text.teritary">
                        {currency} {parseFloat(stockQuote.price).toFixed(2)}
                    </Typography>
                    <Typography variant="h6" color={parseFloat(stockQuote.change) > 0 ? 'green' : 'red'}>
                        {parseFloat(stockQuote.change).toFixed(2)} ({parseFloat(stockQuote.changePercent.slice(0, -1)).toFixed(2)}%)
                    </Typography>
                </Box>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                            <Tab label="Quick Insights" value="1" />
                            <Tab label="Company Description" value="2" />
                        </TabList>
                    </Box>
                    <TabPanel value="1">
                        <Grid container spacing={2} minHeight={160}>
                            <Grid xs={4} display="flex" alignItems="center">
                                <List dense={false}>
                                    <ListItem>
                                        <ListItemText
                                            primary="Single-line item"
                                            secondary={'Secondary text'}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary="Single-line item"
                                            secondary={'Secondary text'}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary="Single-line item"
                                            secondary={'Secondary text'}
                                        />
                                    </ListItem>
                                </List>
                            </Grid>
                            <Grid xs={4} display="flex" alignItems="center">
                                <List dense={false}>
                                    <ListItem>
                                        <ListItemText
                                            primary="Single-line item"
                                            secondary={'Secondary text'}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary="Single-line item"
                                            secondary={'Secondary text'}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary="Single-line item"
                                            secondary={'Secondary text'}
                                        />
                                    </ListItem>
                                </List>
                            </Grid>
                            <Grid xs={4} display="flex" alignItems="center">
                                <List dense={false}>
                                    <ListItem>
                                        <ListItemText
                                            primary="Single-line item"
                                            secondary={'Secondary text'}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary="Single-line item"
                                            secondary={'Secondary text'}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary="Single-line item"
                                            secondary={'Secondary text'}
                                        />
                                    </ListItem>
                                </List>
                            </Grid>
                        </Grid>
                    </TabPanel>
                    <TabPanel value="2">
                        <Typography>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero, id illo suscipit, reprehenderit ad eum itaque quod velit perferendis, numquam dolorem illum nulla? Sint dolor ut eum unde asperiores repellendus.
                        </Typography>
                    </TabPanel>
                </TabContext>
            </CardContent>
        </Card>
    );
}

export default StockInfoCard;