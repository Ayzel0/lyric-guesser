const express = require('express');
const querystring = require('querystring');
const axios = require('axios');

const app = express();
require('dotenv').config();
const port = '8888';

// process variables
const CLIENT_ID = process.env.CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

/**
 * @param {number} length which determines how long the state string will be
 * @returns {string} which is our state key
 * 
 * The purpose of generating a state key is for security. The server (this code) generates a string
 * which gets passed to the client. The client sends this string to the server, and the server should send
 * the same string back. If we get a different string back, then we know that the response may not be
 * legitimate.
 */
const generateRandomString = (length) => {
    let returnText = '';
    const possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
    for (let i = 0; i<length; i++) {
        returnText += possibleCharacters.at(Math.floor(Math.random() * possibleCharacters.length));
    }
    return returnText;
}

// key for the key-value pair of state. This is the key for the value generated by
// generateRandomString()
const stateKey = 'spotify_auth_state'

/**
 * default path. Used only for debug.
 */
app.get('/', (req, res) =>{
    res.send(req.query.access_token);
})

/**
 * Sets up the spotify auth flow. Sends the user to the spotify auth endpoint, which then returns
 * a callback with the user's token in the url parameters.
 */
app.get('/login', (req, res) => {
    // set up the state cookie on the client browser, which we'll check later when we get a response
    const stateValue = generateRandomString(16)
    res.cookie(stateKey, stateValue);

    // variables which stores the scopes that we want the user to authorize us to use
    const scope = [
        'user-read-private',
        'user-read-email',
        'playlist-read-private',
        'user-top-read'
    ].join(' ')

    // we generate query parameters which are sent in the URL to the spotify auth site
    const queryParams = querystring.stringify({
        client_id: CLIENT_ID,
        response_type: 'code', // indicates that we want to get a token
        redirect_uri: REDIRECT_URI,
        state: stateValue,
        scope: scope
    })
    
    // now, actually redirect the user to the auth website with the given query parameters
    res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

/** 
 * handle the callback that we receive from the spotify authentication endpoint. Extracts 
 * parameters from the parameters in the URL, gets auth token from code in parameters, and then
 * sends all response information back to localhost:3000 (or whatever the link is)
 */
app.get('/callback', (req, res) => {
    // authorization code that we need to get an auth token
    const code = req.query.code || null;

    // set up the axios post request with the code to the token getting endpoint, so that we can get auth token
    axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: querystring.stringify({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI
        }),
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`
        }
    })
    .then(response => {
        if(response.status === 200) {
            const { access_token, refresh_token, expires_in } = response.data;

            const queryParams = querystring.stringify({
                access_token, refresh_token, expires_in
            })
            
            res.redirect(`http://localhost:5173/?${queryParams}`);
        } else {
            res.redirect(`/?${querystring.stringify({ error: 'invalid_token'})}`);
        }
    })
    .catch(error => {
        res.send(error);
    })
})

app.get('/refresh_token', (req, res) => {
    const { refresh_token } = req.query;
    
    axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: querystring.stringify({
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        }),
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        },
    })
    .then(response => {
        res.send(response.data);
    })
    .catch(error => {
        res.send(error);
    });
});

app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
});