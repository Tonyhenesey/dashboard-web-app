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
    AGLD: 'Adventure Gold',
    FJD: 'Fijian Dollar',
    MXN: 'Mexican Peso',
    LVL: 'Latvian Lats',
    SCR: 'Seychellois Rupee',
    CDF: 'Congolese Franc',
    BBD: 'Barbadian Dollar',
    HNL: 'Honduran Lempira',
};

const CurrencyConverter = ({ currencyRates }) => {
    const [amount, setAmount] = useState(1);
    const [fromCurrency, setFromCurrency] = useState('PLN');
    const [toCurrency, setToCurrency] = useState('USD');
    const [convertedAmount, setConvertedAmount] = useState(null);

    useEffect(() => {
        if (!currencyRates || !currencyRates.rates) {
            setConvertedAmount(null);
            return;
        }

        const fromRate = currencyRates.rates[fromCurrency];
        const toRate = currencyRates.rates[toCurrency];

        if (!fromRate || !toRate) {
            setConvertedAmount(null);
            return;
        }

        const result = (amount / fromRate) * toRate;
        setConvertedAmount(result.toFixed(2));
    }, [amount, fromCurrency, toCurrency, currencyRates]);

    return (
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
            {convertedAmount !== null && (
                <Typography variant="h6" sx={{ mt: 2 }}>
                    {`${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`}
                </Typography>
            )}
        </Box>
    );
};

const App = () => {
    const [accessToken, setAccessToken] = useState('');
    const [repos, setRepos] = useState([]);
    const [weather, setWeather] = useState(null);
    const [currencyRates, setCurrencyRates] = useState(null);
    const [city, setCity] = useState('');
    const [weatherIcon, setWeatherIcon] = useState('');
    const weatherIcons = {
        0: "☀️",
        1: "🌤️",
        111: "🌨️",
        112: "🌨️",
        121: "🌧️",
        122: "🌧️",
        131: "🌦️",
        132: "🌦️",
        2: "⛅",
        211: "🌨️",
        212: "🌨️",
        221: "🌧️",
        222: "🌧️",
        231: "🌦️",
        232: "🌦️",
        3: "☁️",
        311: "🌨️",
        312: "🌨️",
        321: "🌧️",
        322: "🌧️",
        331: "🌦️",
        332: "🌦️",
        4: "☁️",
        411: "🌨️",
        412: "🌨️",
        421: "🌧️",
        422: "🌧️",
        431: "🌦️",
        432: "🌦️",
        5: "🌤️",
        default: "🌤️",
    };

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
        if (!city) {
            alert('Proszę wprowadzić miasto.');
            return;
        }

        try {
            const response = await axios.get('http://localhost:3000/api/weather', {
                params: { city },
            });
            setWeather(response.data);

            const weatherCode = response.data.day.weather_code;
            const icon = weatherIcons[weatherCode] || weatherIcons.default;
            setWeatherIcon(icon);
        } catch (error) {
            console.error('Error fetching weather:', error);
            alert('Nie udało się pobrać danych pogodowych.');
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
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            <Grid item xs={12} sm={6}>
                                <Paper elevation={3} sx={{ p: 2 }}>
                                    <Typography variant="h6">{weather.city}</Typography>
                                    <Typography>{`Dzień`}</Typography>
                                    <Typography>{`Data: ${weather.date}`}</Typography>
                                    <Typography>{`Temperatura: ${weather.day.temp_max}°C`}</Typography>
                                    <Typography>{`Prędkość wiatru: ${weather.day.wind_velocity} km/h`}</Typography>
                                    <Typography variant="h4" sx={{ mt: 2 }}>
                                        {weatherIcons[weather.day.icon] || weatherIcons.default}
                                    </Typography>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Paper elevation={3} sx={{ p: 2 }}>
                                    <Typography variant="h6">{weather.city}</Typography>
                                    <Typography>{`Noc`}</Typography>
                                    <Typography>{`Data: ${weather.date}`}</Typography>
                                    <Typography>{`Temperatura: ${weather.night.temp_max}°C`}</Typography>
                                    <Typography>{`Prędkość wiatru: ${weather.night.wind_velocity} km/h`}</Typography>
                                    <Typography variant="h4" sx={{ mt: 2 }}>
                                        {weatherIcons[weather.night.icon] || weatherIcons.default}
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    )}
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
                                {Object.entries(currencyRates.rates)
                                    .filter(([currency]) => ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'PLN'].includes(currency))
                                    .map(([currency, rate]) => (
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

                <CurrencyConverter currencyRates={currencyRates} />
            </Container>
        </ThemeProvider>
    );
};

export default App;