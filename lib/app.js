/* eslint-disable indent */
const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
// const client = require('./client.js');
const fetch = require('node-fetch');

const app = express();

app.use(express.json());
app.use(cors());

app.get('/puppeteer', async (req, res) => {
    const { url } = req.query;
    if (!url) {
        res.status(400).send('Bad request: <url> param is missing');
        return;
    }

    try {
        const html = await getPageHTML(url);
        res.status(200).send(html);
    } catch (error) {
        res.status(500).send(error);
    }
});

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

const getPageHTML = async (pageUrl) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(pageUrl);
    const pageHTML = await page.evaluate(
        'new XMLSerializer().serializeToString(document.doctype) + document.documentElement.outerHTML'
    );
    await browser.close();
    return pageHTML;
};

app.use(require('./middleware/not-found.js'));
app.use(require('./middleware/error.js'));

module.exports = app;
