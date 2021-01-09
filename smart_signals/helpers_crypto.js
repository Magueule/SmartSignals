function createCoinObject(promise) {
	return {
		'price': promise.price_usd,
		'rsi_30min': promise.rsi_30min,
		'status': setFirstStatus(promise.rsi_30min),
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
