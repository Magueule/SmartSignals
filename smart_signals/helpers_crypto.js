const { RSI_REF } = require('./smart_signals_constants');

function createCoinObject(promise) {
	return {
		'price': promise.price_usd,
		[RSI_REF]: promise[RSI_REF],
		'status': setFirstStatus(promise[RSI_REF]),
		'date': Date()
	};
}

function setFirstStatus(rsi) {
	if (rsi <= 30) {
		return 'red';
	} else if (rsi >= 70) {
		return 'green';
	}
	return 'yellow';
}

function getCoinLastStatus(coinData, coins_list) {
	return coins_list[coinData.coin_symbol].status;
}

module.exports = {
	createCoinObject,
	getCoinLastStatus
};
