require('dotenv').config();

module.exports = {
  // Bot configuration
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,

  // Web server configuration
  port: process.env.PORT || 3000,

  // Discord configuration
  discord: {
    intents: [
      'Guilds',
      'GuildMessages',
      'MessageContent'
    ],
    embedColors: {
      primary: '#5865F2',
      support: '#EA4AAA'
    }
  }
};