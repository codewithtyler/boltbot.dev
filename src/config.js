require('dotenv').config();

// Debug environment variables (without exposing sensitive values)
console.log('\nEnvironment Check:');
console.log('DISCORD_TOKEN:', process.env.DISCORD_TOKEN ? '[PRESENT]' : '[MISSING]');
console.log('CLIENT_ID:', process.env.CLIENT_ID ? '[PRESENT]' : '[MISSING]');
console.log('PORT:', process.env.PORT || '3000 (default)\n');

module.exports = {
  // Bot configuration
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,

  // Web server configuration
  port: process.env.PORT || 3000,

  // Discord configuration
  discord: {
    intents: ['Guilds'],  // We only need Guilds intent for slash commands
    embedColors: {
      primary: '#5865F2',
      support: '#EA4AAA'
    }
  }
};