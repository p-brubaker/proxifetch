/* eslint-disable indent */
const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
const Character = require('./models/Character');
const getByName = require('./utils/getByName');

const app = express();
app.use(express.json());
app.use(cors());
app.options('*', cors());

app.get('/puppeteer', async (req, res) => {
    const { name } = req.query;
    if (!name) {
        res.status(400).send('Bad request: <name> param is missing');
        return;
    }

    const characters = await Character.getAll();

    const url = getByName(characters, name);

    if (url === 'image not available') {
        res.status(200).json({ name, url: 'image not available' });
    } else if (url) {
        res.json({ name, url });
    } else {
        try {
            const wikiUrl = `https://en.wikipedia.org/wiki/${name}`;
            const character = await getPageHTML(name, wikiUrl);
            res.status(200).json(character);
        } catch (error) {
            await Character.create({ name, url: 'image not available' });
            res.status(200).send({ name, url: 'image not available' });
        }
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

const getPageHTML = async (name, pageUrl) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(pageUrl);
    const pageHTML = await page.evaluate(
        'new XMLSerializer().serializeToString(document.doctype) + document.documentElement.outerHTML'
    );
    await browser.close();
    const imageUrlPattern = /(?<=og:image).*/;
    const starWarsPattern = /Star\sWars/;
    const foundStarWars = pageHTML.match(starWarsPattern)[0];
    if (!foundStarWars) {
        await Character.create({ name, url: 'image not available' });
        return { name, url: 'image not available' };
    }
    const imageUrlRaw = pageHTML.match(imageUrlPattern)[0];
    if (imageUrlRaw === null) {
        return Character.create({ name, url: 'image not available' });
    }
    const character = Character.create({
        name,
        url: imageUrlRaw.slice(11, -2),
    });
    return character;
};

app.use(require('./middleware/not-found.js'));
app.use(require('./middleware/error.js'));

module.exports = app;
