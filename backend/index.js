const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const { AuthorizationCode } = require('simple-oauth2');

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

// Konfiguracja OAuth2 dla GitHub
const oauth2 = new AuthorizationCode({
    client: {
        id: process.env.GITHUB_CLIENT_ID,
        secret: process.env.GITHUB_CLIENT_SECRET,
    },
    auth: {
        tokenHost: 'https://github.com',
        tokenPath: '/login/oauth/access_token',
        authorizePath: '/login/oauth/authorize',
    },
});

// Endpoint do logowania przez GitHub
app.get('/auth/github', (req, res) => {
    const authorizationUri = oauth2.authorizeURL({
        redirect_uri: 'http://localhost:3000/auth/github/callback', // Upewnij się, że to jest poprawny adres
        scope: 'repo',
    });
    res.redirect(authorizationUri);
});

// Callback URL po autoryzacji
app.get('/auth/github/callback', async (req, res) => {
    const { code } = req.query;

    try {
        const tokenParams = {
            code,
            redirect_uri: 'http://localhost:3000/auth/github/callback',
        };
        const accessToken = await oauth2.getToken(tokenParams);

        res.redirect(`http://localhost:3001?access_token=${accessToken.token.access_token}`);
    } catch (error) {
        res.status(500).json({ error: 'Failed to authenticate' });
    }
});

// Pobierz listę repo
app.get('/api/github/repos', async (req, res) => {
    const { access_token } = req.query;

    try {
        const response = await axios.get('https://api.github.com/user/repos', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data from GitHub' });
    }
});

// Pobierz pogodę dla wybranego miasta
app.get('/api/weather', async (req, res) => {
    const { city } = req.query;

    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHERMAP_API_KEY}`
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// Pobierz listę publicznych API
app.get('/api/public-apis', async (req, res) => {
    try {
        const response = await axios.get('https://api.publicapis.org/entries');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch public APIs' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});