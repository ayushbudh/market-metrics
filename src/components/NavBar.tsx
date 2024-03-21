import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Avatar from '@mui/material/Avatar';
import MarketMetricsLogo from "../../market-metrics-logo.png";

const NavBar = () => {
    const [scrolling, setScrolling] = useState(false);

    const handleScroll = () => {
        if (window.scrollY > 0) {
            setScrolling(true);
        } else {
            setScrolling(false);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);


    return (
        <Box sx={{ display: "flex" }} mb={12}>
            <CssBaseline />
            <AppBar component="nav" color={scrolling ? "primary" : "transparent"} sx={{ boxShadow: scrolling ? "1px solid black" : 0, borderRadius: "0px 0 15px 15px" }}>
                <Toolbar>
                    <Avatar alt="Market Metrics Logo" src={MarketMetricsLogo} />
                    <Typography
                        ml={1}
                        variant="h5"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        Market Metrics
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default NavBar;