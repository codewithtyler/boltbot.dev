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
