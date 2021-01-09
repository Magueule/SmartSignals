const axios = require('axios');

const HELPERS = require('../helpers/helpers');
const { QUANTIFY_OPTIONS, URL_DEFAULT } = require('./config_constants');

// Get information about one coin
async function getSingleCoin(coin) {
	await HELPERS.sleep(2000);
	try {
		return await axios.get(URL_DEFAULT + coin, QUANTIFY_OPTIONS).then((res) => res.data);
	} catch (e) {
		console.error(`Quantify: error while getting data. (${coin})`);
	}

}

module.exports = {
	getSingleCoin
};
