const express = require('express');
const querystring = require('querystring');
const axios = require('axios');

const app = express();
require('dotenv').config();
const port = '8888';

// Musixmatch variables
const MUSIXMATCH_KEY = process.env.MUSIXMATCH_KEY;

app.get('/', (req, res) => {
    const { name } = req.query;
    res.json(name);
});
  
app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
});