import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Button,
    TextField,
    Grid,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    Paper,
    Box,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#90caf9',
        },
        secondary: {
            main: '#f48fb1',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
    },
});

// Mapa pełnych nazw walut
const currencyNames = {
    USD: 'United States Dollar',
    EUR: 'Euro',
    GBP: 'British Pound Sterling',
    JPY: 'Japanese Yen',
    AUD: 'Australian Dollar',
    CAD: 'Canadian Dollar',
    CHF: 'Swiss Franc',
    CNY: 'Chinese Yuan',
    SEK: 'Swedish Krona',
    NZD: 'New Zealand Dollar',
    PLN: 'Polish Złoty',
    // Dodaj więcej walut według potrzeb
    AGLD: 'Adventure Gold',
    FJD: 'Fijian Dollar',
    MXN: 'Mexican Peso',
    LVL: 'Latvian Lats',
    SCR: 'Seychellois Rupee',
    CDF: 'Congolese Franc',
    BBD: 'Barbadian Dollar',
    HNL: 'Honduran Lempira',
};

const App = () => {
    const [accessToken, setAccessToken] = useState('');
    const [repos, setRepos] = useState([]);
    const [weather, setWeather] = useState(null);
    const [publicApis, setPublicApis] = useState([]);
    const [currencyRates, setCurrencyRates] = useState(null);
    const [historicalRates, setHistoricalRates] = useState(null);
    const [city, setCity] = useState('');
    const [amount, setAmount] = useState(1);
    const [fromCurrency, setFromCurrency] = useState('PLN');
    const [toCurrency, setToCurrency] = useState('USD');
    const [convertedAmount, setConvertedAmount] = useState(null);
    const [historicalDate, setHistoricalDate] = useState('');

    // Przechwycenie access token z URL po przekierowaniu z GitHub
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('access_token');
        if (token) {
            setAccessToken(token);
            // Usuń access token z URL, aby uniknąć ponownego użycia
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    // Pobieranie repo z GitHub
    const fetchRepos = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/github/repos', {
                params: { access_token: accessToken },
            });
            setRepos(response.data);
        } catch (error) {
            console.error('Error fetching repos:', error);
        }
    };

    // Pobieranie pogody
    const fetchWeather = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/weather', {
                params: { city },
            });
            setWeather(response.data);
        } catch (error) {
            console.error('Error fetching weather:', error);
        }
    };

    // Pobieranie publicznych API
    const fetchPublicApis = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/public-apis');
            setPublicApis(response.data.entries);
        } catch (error) {
            console.error('Error fetching public APIs:', error);
        }
    };

    // Pobieranie aktualnych kursów walut
    const fetchCurrencyRates = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/currency-rates');
            setCurrencyRates(response.data);
        } catch (error) {
            console.error('Error fetching currency rates:', error);
        }
    };

    // Pobieranie historycznych kursów walut
    const fetchHistoricalRates = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/currency-rates/historical', {
                params: { date: historicalDate },
            });
            setHistoricalRates(response.data);
        } catch (error) {
            console.error('Error fetching historical rates:', error);
        }
    };

    // Kalkulator walut
    const convertCurrency = () => {
        if (!currencyRates || !currencyRates.rates) {
            alert('Najpierw pobierz aktualne kursy walut.');
            return;
        }

        const fromRate = currencyRates.rates[fromCurrency];
        const toRate = currencyRates.rates[toCurrency];

        if (!fromRate || !toRate) {
            alert('Nieprawidłowe waluty.');
            return;
        }

        const result = (amount / fromRate) * toRate;
        setConvertedAmount(result.toFixed(2));
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container>
                <Box sx={{ my: 4 }}>
                    <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
                        Data Dashboard
                    </Typography>
                </Box>

                {!accessToken ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <Button variant="contained" color="primary" onClick={() => window.location.href = 'http://localhost:3000/auth/github'} size="large">
                            Login with GitHub
                        </Button>
                    </Box>
                ) : (
                    <>
                        <Box sx={{ my: 4 }}>
                            <Button variant="contained" color="secondary" onClick={fetchRepos} fullWidth>
                                Fetch Repositories
                            </Button>
                            <Paper elevation={3} sx={{ mt: 2, p: 2 }}>
                                <List>
                                    {repos.slice(0, 5).map((repo) => (
                                        <ListItem key={repo.id}>
                                            <ListItemText primary={repo.name} secondary={repo.description} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        </Box>
                    </>
                )}

                <Box sx={{ my: 4 }}>
                    <TextField
                        label="Enter City"
                        variant="outlined"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <Button variant="contained" color="primary" onClick={fetchWeather} fullWidth>
                        Get Weather
                    </Button>
                    {weather && (
                        <Paper elevation={3} sx={{ mt: 2, p: 2 }}>
                            <Typography variant="h6">{weather.city}</Typography>
                            <Typography>{`Data: ${weather.date}`}</Typography>
                            <Typography>{`Temperatura: ${weather.day.temp_max}°C`}</Typography>
                            <Typography>{`Prędkość wiatru: ${weather.day.wind_velocity} km/h`}</Typography>
                        </Paper>
                    )}
                </Box>

                <Box sx={{ my: 4 }}>
                    <Button variant="contained" color="primary" onClick={fetchPublicApis} fullWidth>
                        Fetch Public APIs
                    </Button>
                    <Grid container spacing={3} sx={{ mt: 2 }}>
                        {publicApis.slice(0, 6).map((api, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card elevation={3}>
                                    <CardContent>
                                        <Typography variant="h6" color="primary">
                                            {api.API}
                                        </Typography>
                                        <Typography>{api.Description}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Box sx={{ my: 4 }}>
                    <Button variant="contained" color="primary" onClick={fetchCurrencyRates} fullWidth>
                        Fetch Currency Rates
                    </Button>
                    {currencyRates && (
                        <Paper elevation={3} sx={{ mt: 2, p: 2 }}>
                            <Typography variant="h6">Currency Rates</Typography>
                            <Typography>{`Date: ${currencyRates.date}`}</Typography>
                            <Typography>{`Base Currency: ${currencyRates.base}`}</Typography>
                            <Grid container spacing={2} sx={{ mt: 2 }}>
                                {Object.entries(currencyRates.rates).slice(0, 6).map(([currency, rate]) => (
                                    <Grid item xs={12} sm={6} md={4} key={currency}>
                                        <Card elevation={3}>
                                            <CardContent>
                                                <Typography variant="h6" color="primary">
                                                    {currency} - {currencyNames[currency] || 'Unknown Currency'}
                                                </Typography>
                                                <Typography>{`Rate: ${parseFloat(rate).toFixed(2)}`}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    )}
                </Box>

                {/* Kalkulator walut */}
                <Box sx={{ my: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Currency Converter
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="Amount"
                                variant="outlined"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="From Currency"
                                variant="outlined"
                                value={fromCurrency}
                                onChange={(e) => setFromCurrency(e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="To Currency"
                                variant="outlined"
                                value={toCurrency}
                                onChange={(e) => setToCurrency(e.target.value)}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                    <Button variant="contained" color="primary" onClick={convertCurrency} sx={{ mt: 2 }}>
                        Convert
                    </Button>
                    {convertedAmount && (
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            {`${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`}
                        </Typography>
                    )}
                </Box>

                {/* Historyczne kursy walut */}
                <Box sx={{ my: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Historical Exchange Rates
                    </Typography>
                    <TextField
                        label="Date (YYYY-MM-DD)"
                        variant="outlined"
                        value={historicalDate}
                        onChange={(e) => setHistoricalDate(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <Button variant="contained" color="primary" onClick={fetchHistoricalRates} fullWidth>
                        Fetch Historical Rates
                    </Button>
                    {historicalRates && (
                        <Paper elevation={3} sx={{ mt: 2, p: 2 }}>
                            <Typography variant="h6">Historical Rates</Typography>
                            <Typography>{`Date: ${historicalRates.date}`}</Typography>
                            <Typography>{`Base Currency: ${historicalRates.base}`}</Typography>
                            <Grid container spacing={2} sx={{ mt: 2 }}>
                                {Object.entries(historicalRates.rates).slice(0, 6).map(([currency, rate]) => (
                                    <Grid item xs={12} sm={6} md={4} key={currency}>
                                        <Card elevation={3}>
                                            <CardContent>
                                                <Typography variant="h6" color="primary">
                                                    {currency} - {currencyNames[currency] || 'Unknown Currency'}
                                                </Typography>
                                                <Typography>{`Rate: ${parseFloat(rate).toFixed(2)}`}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    )}
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default App;