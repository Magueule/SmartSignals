const express = require('express');
const app = express();

const crypto = require("./smart_signals/crypto");
crypto.getAllCrypto();

app.get('', async (req, res) => {
	res.send('Hello');
});

app.get('/cryptoList', async (req, res) => {
	const result = crypto.getCoins();
	res.send(result);
});

app.listen(3001, () => {
	console.log(`App listening at http://localhost:3001`)
});
