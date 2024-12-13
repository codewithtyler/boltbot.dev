const { Client, GatewayIntentBits, Collection } = require('discord.js');
const config = require('./config');
const { loadCommands } = require('./utils/loadCommands');
const { deployCommands } = require('./utils/commands');
const { startWebServer } = require('./web/server');

// Enhance error logging
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
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

  console.log(`Command received: ${interaction.commandName} from ${interaction.user.tag}`);

  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) {
    console.warn(`Unknown command: ${interaction.commandName}`);
    return;
  }

  try {
    // Defer the reply immediately to prevent timeout
    await interaction.deferReply();
    
    console.log(`Executing command: ${interaction.commandName}`);
    await command.execute(interaction);
    console.log(`Command completed: ${interaction.commandName}`);
    
  } catch (error) {
    console.error('Command execution error:', {
      command: interaction.commandName,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      }
    });

    const errorMessage = {
      content: 'There was an error executing this command!',
      ephemeral: true 
    };
    await interaction.editReply(errorMessage);
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