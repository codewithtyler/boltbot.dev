const { Client, GatewayIntentBits, Collection } = require('discord.js');
const config = require('./config');
const { loadCommands } = require('./utils/loadCommands');
const { deployCommands } = require('./utils/commands');
const { startWebServer } = require('./web/server');

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

// Validate required environment variables
if (!config.token) {
  console.error('Error: Missing DISCORD_TOKEN in environment variables');
  process.exit(1);
}

if (!config.clientId) {
  console.error('Error: Missing CLIENT_ID in environment variables');
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]  // Only need Guilds for slash commands
});

client.commands = new Collection();
loadCommands(client);

client.once('ready', async () => {
  console.log(`Bot is ready! Logged in as ${client.user.tag}`);
  try {
    await deployCommands(client);
  } catch (error) {
    console.error('Failed to deploy commands:', error);
    // Don't exit process, allow bot to continue running
  }
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

client.login(config.token).catch(error => {
  console.error('Failed to login to Discord:');
  if (error.code === 'TokenInvalid') {
    console.error('The provided token is invalid. Please check your DISCORD_TOKEN environment variable.');
  } else if (error.code === 'DisallowedIntents') {
    console.error('The bot is missing required privileged intents. Please check the Discord Developer Portal.');
  } else {
    console.error(error);
  }
  process.exit(1);
});