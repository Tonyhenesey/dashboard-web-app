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

const App = () => {
    const [accessToken, setAccessToken] = useState('');
    const [repos, setRepos] = useState([]);
    const [weather, setWeather] = useState(null);
    const [publicApis, setPublicApis] = useState([]);
    const [city, setCity] = useState('');

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

    //  pobieranie repo z GitHub
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

    //  pobieranie pogody
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

    //pobieranie publicznych API
    const fetchPublicApis = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/public-apis');
            setPublicApis(response.data.entries);
        } catch (error) {
            console.error('Error fetching public APIs:', error);
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
                        <Paper elevation={3} sx={{ mt: 2, p: 2 }}>
                            <Typography variant="h6">{weather.city}</Typography>
                            <Typography>{`Data: ${weather.date}`}</Typography>
                            <Typography>{`Temperatura: ${weather.day.temp_max}°C`}</Typography>
                            <Typography>{`Prędkośc wiatru: ${weather.day.wind_velocity} km/h`}</Typography>
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
            </Container>
        </ThemeProvider>
    );
};

export default App;