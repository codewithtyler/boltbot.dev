const { Client, GatewayIntentBits, Collection } = require('discord.js');
const config = require('./config');
const { loadCommands } = require('./utils/loadCommands');
const { startWebServer } = require('./web/server');

// Validate required environment variables
if (!config.token) {
  console.error('Error: Missing DISCORD_TOKEN in environment variables');
  process.exit(1);
}

if (!config.clientId) {
  console.error('Error: Missing CLIENT_ID in environment variables');
  process.exit(1);
}

// Initialize Discord client
const client = new Client({
  intents: [GatewayIntentBits.Guilds]  // Only need Guilds for slash commands
});

client.commands = new Collection();
loadCommands(client);

client.once('ready', () => {
  console.log(`Bot is ready! Logged in as ${client.user.tag}`);
  console.log(`Bot invite link: https://discord.com/api/oauth2/authorize?client_id=${config.clientId}&permissions=2048&scope=bot%20applications.commands`);
  startWebServer();
});

client.on('error', error => {
  console.error('Discord client error:', error);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    const errorMessage = {
      content: 'There was an error executing this command!',
      ephemeral: true
    };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  }
});
