/* eslint-disable indent */
const express = require('express');
const cors = require('cors');
// const client = require('./client.js');
const fetch = require('node-fetch');

const app = express();

app.use(express.json());
app.use(cors());

app.post('/', async (req, res) => {
    let { url } = req.body;
    const { body, params, method, token } = req.body;

    if (params) {
        url = new URL(url);
        url.search = new URLSearchParams(params).toString();
    }

    const response = await fetch(url, {
        method,
        headers: token
            ? {
                  'Content-Type': 'application/json',
                  Authorization: token,
              }
            : {
                  'Content-Type': 'application/json',
              },
        body,
    });

    const data = await response.json();
    res.send(data);
});

app.use(require('./middleware/not-found.js'));
app.use(require('./middleware/error.js'));

module.exports = app;
