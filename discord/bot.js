const axios = require('axios');
const { DISCORD_BOT_URL } = require('./config_constants');

async function send_msg(message) {
	try {
		await axios.post(DISCORD_BOT_URL, {'content': message});
	} catch (e) {
		console.error('Discord: error while sending message.', e);
	}
}

async function send_msg_tuile(data) {
	console.log('ICI');
	console.log(typeof data);
	try {
		await axios.post(DISCORD_BOT_URL, data);
	} catch (e) {
		console.error('Discord: error while sending message.', e);
	}
}

module.exports = {
	send_msg,
	send_msg_tuile
};