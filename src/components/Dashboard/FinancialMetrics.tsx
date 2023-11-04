import { useState } from 'react';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import MarketSentimentChart from './MarketSentimentChart';
import RevenueChart from './RevenueChart';

const FinancialMetrics = ({ tickerName }: { tickerName: string }) => {
    const [value, setValue] = useState('1');

    const handleChange = (_: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };
    return (
        <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                    <Tab label="Market Sentiment" value="1" />
                    <Tab label="Annual Revenue Change" value="2" />
                </TabList>
            </Box>
            <TabPanel value="1">
                <MarketSentimentChart tickerName={tickerName} />
            </TabPanel>
            <TabPanel value="2">
                <RevenueChart tickerName={tickerName} />
            </TabPanel>
        </TabContext>
    );
}

export default FinancialMetrics;