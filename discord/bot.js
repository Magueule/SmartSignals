const axios = require('axios');
const { DISCORD_BOT_URL } = require('./config_constants');

async function send_msg(message) {
	try {
		await axios.post(DISCORD_BOT_URL, {'content': message});
	} catch (e) {
		console.error('Discord: error while sending message.', e);
	}

}

module.exports = {
	send_msg
}; 

// Example 1
// {
//   "content": "@everyone",
//   "embed": {
//     "footer": {
//       "text": "Ceci n'est pas un conseil financier."},
//     "thumbnail": {
//       "url": "https://assets-global.website-files.com/5c0e70439a14797357f10649/5c6526827405c97305f8724c_favicon-green-webclip.png"},
//     "title": "CHSB enter a selling zone.",
//     "description": "\nPrice: 5$. RSI_30min: 70.7901. Trend: 88/100. Safety: 60/100",
//     "color": 16774912
//   }
// }

// Exemple 2
// {
//   "embed": {
//     "title": "CHSB enter a selling zone.\n\n",
//     "color": 2795028,
//     "thumbnail": {
//       "url": "https://assets-global.website-files.com/5c0e70439a14797357f10649/5c6526827405c97305f8724c_favicon-green-webclip.png"
//     },
//     "fields":[
//       {
//         "name": "Cyborg Predictor",
//         "value": "Buying - 3/5",
//         "inline": true
//       },
//       {
//         "name": "Swissborg Predictor",
//         "value": "Buying - 5/5",
//         "inline": true
//       }
//     ],
//     "footer": {
//       "text": "Ceci n'est pas un conseil financier."
//     }
//   }
// }

//Example 3
// {
//   "username": "Smart Signals",
//   "avatar_url": "https://imgur.com/a/Cl3zspb",
//   "embeds": [{
//     "title": "CHSB enter a buying zone.\n\n",
//     "color": 2795028,
//     "thumbnail": {
//       "url": "https://assets-global.website-files.com/5c0e70439a14797357f10649/5c6526827405c97305f8724c_favicon-green-webclip.png"
//     },
//     "fields":[
//       {
//         "name": "Cyborg Predictor",
//         "value": "Buying - 3/5",
//         "inline": true
//       },
//       {
//         "name": "Swissborg Predictor",
//         "value": "Buying - 5/5",
//         "inline": true
//       }
//     ],
//     "footer": {
//       "text": "This is not a financial advice."
//     }
//   }]
// }