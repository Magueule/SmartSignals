const { CRYPTO_LIST, RSI_REF } = require('./smart_signals_constants');
const DISCORD = require('../discord/bot');
const QTF = require('../quantify/quantify');
const HELPERS = require('../helpers/helpers');
const CRYPTOHELPERS = require('./helpers_crypto');

let coinList = 'Not initialized';

// Start Algo
async function getAllCrypto() {
	await DISCORD.send_msg('Starting bot..');
	await set_coin_list();
	lauchScriptLoop();

	return 'Script launched';
}

// Get actual image of the market and return
function getCoins() {
	return coinList;
}

// -----------------------------------------------------------------
// -----------------------------------------------------------------

// Set actual image of the market
async function set_coin_list() {
	const result = {};
	for (let i = 0; i < CRYPTO_LIST.length; i++) {
		const coinData = await QTF.getSingleCoin(CRYPTO_LIST[i]);
		result[coinData.coin_symbol] = CRYPTOHELPERS.createCoinObject(coinData);
	}
	coinList = result;
}

// Start looping for rsi status updates
async function lauchScriptLoop(){
	while(true) {
		for (let i = 0; i < CRYPTO_LIST.length; i++) {
			await HELPERS.sleep(10000);
			const coinData = await QTF.getSingleCoin(CRYPTO_LIST[i]);
			const coinLastStatus = await CRYPTOHELPERS.getCoinLastStatus(coinData, coinList);

			await applyStrategy(coinData, coinLastStatus);

			console.log(new Date, coinData.coin_symbol);
		}
	}
}

// Check if indicator meets the strategy
async function applyStrategy(coinData, coins_list_status) {
	const redCondition = getRedConditions(coinData, coins_list_status);
	const yellowCondition = getYellowConditions(coinData, coins_list_status);
	const greenCondition = getGreenConditions(coinData, coins_list_status);

	const data = {
		coin_symbol: coinData.coin_symbol,
		price: coinData.price_usd,
		[RSI_REF]: coinData[RSI_REF],
		trend: coinData.trend_mean,
		safety: coinData.safety,
	};

	if (redCondition) {
		data.condition = 'redCondition';
		await conditionFilled(data);
	} else if (yellowCondition) {
		data.condition = 'yellowCondition';
		await conditionFilled(data);
	} else if (greenCondition) {
		data.condition = 'greenCondition';
		await conditionFilled(data);
	}
}

function getRedConditions(coinData, coins_list_status) {
	return coinData[RSI_REF] <= 30 && coins_list_status !== 'red';
}

function getYellowConditions(coinData, coins_list_status) {
	return coinData[RSI_REF] > 30 && coinData[RSI_REF] < 70 && coins_list_status !== 'yellow';
}

function getGreenConditions(coinData, coins_list_status) {
	return coinData[RSI_REF] >= 70 && coins_list_status !== 'green';
}

async function conditionFilled(data) {
	if (data.condition !== 'yellowCondition') {
		const tuile = set_tuile(data);
		await DISCORD.send_msg_tuile(tuile);
	}
	await set_coin_list();
}

function set_tuile(data) {
	const zone = data.condition === 'greenCondition' ? 'selling zone' : 'buying zone';
	const conditionColor = data.condition === 'greenCondition' ? 2795028 : 16390425;
	return {
		"username": "Smart Signals",
		"avatar_url": "https://imgur.com/a/Cl3zspb",
		"embeds": [{
			"title": `${data.coin_symbol} enters a ${zone}.\n\n`,
			"color": conditionColor,
			"thumbnail": {
				"url": "https://assets.coingecko.com/coins/images/12645/large/AAVE.png"
			},
			"fields":[
				{
					"name": "RSI",
					"value": Math.floor(data.rsi_5min),
					"inline": true
				},
				{
					"name": "Trend",
					"value": data.trend,
					"inline": true
				},
				{
					"name": "Safety",
					"value": data.safety,
					"inline": true
				}
			],
			"footer": {
				"text": "This is not a financial advice."
			}
		}]
	};
}

module.exports = {
	getAllCrypto,
	getCoins
};
