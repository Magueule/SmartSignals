const { CRYPTO_LIST } = require('./smart_signals_constants');
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

	let message;
	if (redCondition) {
		message = `${coinData.coin_symbol} in buying zone => Price: ${coinData.price_usd}$. RSI_30min: ${coinData.rsi_30min}. Trend: ${coinData.trend_mean}/100. Safety: ${coinData.safety}/100`;
		console.log(coinData);
		await conditionFilled(message, 'redCondition');
	} else if (yellowCondition) {
		message = `${coinData.coin_symbol} in neutral zone => Price: ${coinData.price_usd}$. RSI_30min: ${coinData.rsi_30min}. Trend: ${coinData.trend_mean}/100. Safety: ${coinData.safety}/100`;
		console.log(coinData);
		await conditionFilled(message, 'yellowCondition');
	} else if (greenCondition) {
		message = `${coinData.coin_symbol} in selling zone => Price: ${coinData.price_usd}$. RSI_30min: ${coinData.rsi_30min}. Trend: ${coinData.trend_mean}/100. Safety: ${coinData.safety}/100`;
		console.log(coinData);
		await conditionFilled(message, 'greenCondition');
	}
}

function getRedConditions(coinData, coins_list_status) {
	return coinData.rsi_30min <= 30 && coins_list_status !== 'red';
}

function getYellowConditions(coinData, coins_list_status) {
	return coinData.rsi_30min > 30 && coinData.rsi_30min < 70 && coins_list_status !== 'yellow';
}

function getGreenConditions(coinData, coins_list_status) {
	return coinData.rsi_30min >= 70 && coins_list_status !== 'green';
}

async function conditionFilled(message, condition) {
	console.log(message);
	await DISCORD.send_msg(message);
	if (condition !== 'yellowCondition') {
		await set_coin_list();
	}
}

module.exports = {
	getAllCrypto,
	getCoins
};
