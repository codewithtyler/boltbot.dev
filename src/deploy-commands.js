const { Client, GatewayIntentBits, Collection } = require('discord.js');
const config = require('./config');
const { loadCommands } = require('./utils/loadCommands');
const { startWebServer } = require('./web/server');

// Enable detailed debugging
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

// Initialize Discord client
const client = new Client({
  intents: [GatewayIntentBits.Guilds]  // Only need Guilds for slash commands
});

console.log('Discord client initialized');

client.commands = new Collection();
console.log('Attempting to load commands...');
loadCommands(client);
console.log('Commands loaded successfully');

client.once('ready', () => {
  console.log(`Bot is ready! Logged in as ${client.user.tag}`);
  // Generate proper invite link with required scopes and permissions
  const inviteLink = `https://discord.com/api/oauth2/authorize?client_id=${config.clientId}&permissions=2048&scope=bot%20applications.commands`;
  console.log('\nTo add the bot to your server:');
  console.log('1. Make sure you have the "Manage Server" permission');
  console.log(`2. Click this link: ${inviteLink}`);
  console.log('3. Select your server and click "Authorize"');
  console.log('\nAfter adding the bot:');
  console.log('1. Run "npm run deploy" to register the slash commands');
  console.log('2. Wait a few minutes for Discord to propagate the commands');
  console.log('3. Type / in your server to see the available commands\n');
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

// Login to Discord
console.log('Attempting to login to Discord...');
client.login(config.token).catch(error => {
  console.error('Failed to login to Discord:');
  if (error.code === 'TokenInvalid') {
    console.error('The provided token is invalid. Please check your DISCORD_TOKEN environment variable.');
    console.error('Token value:', config.token ? '[PRESENT]' : '[MISSING]');
  } else if (error.code === 'DisallowedIntents') {
    console.error('The bot is missing required privileged intents. Please check the Discord Developer Portal.');
  } else {
    console.error(error);
  }
  process.exit(1);
});