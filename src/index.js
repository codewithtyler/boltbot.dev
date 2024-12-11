const { Client, GatewayIntentBits, Collection } = require('discord.js');
const config = require('./config');
const { loadCommands } = require('./utils/loadCommands');
const webServer = require('./web/server');

// Initialize Discord client
const client = new Client({
  intents: config.discord.intents.map(intent => GatewayIntentBits[intent])
});

client.commands = new Collection();
loadCommands(client);

client.once('ready', () => {
  console.log(`Ready! Logged in as ${client.user.tag}`);
  webServer.startWebServer();
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

client.login(process.env.DISCORD_TOKEN);