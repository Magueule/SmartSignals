const axios = require('axios');
const { BOT_URL } = require('./config_constants');

async function send_msg(message) {
	try {
		await axios.post(BOT_URL, {'text': message});
	} catch (e) {
		console.error('Slack: error while sending message.', e);
	}

}

module.exports = {
	send_msg
};
