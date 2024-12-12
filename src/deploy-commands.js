const { REST, Routes } = require('discord.js');
const config = require('./config');
const { loadCommands } = require('./utils/loadCommands');

const client = { commands: new Map() };
const commands = [];

loadCommands(client);

// Convert commands to JSON for registration
for (const command of client.commands.values()) {
  commands.push(command.data.toJSON());
}

const rest = new REST().setToken(config.token);

(async () => {
  if (!config.token || !config.clientId) throw new Error('Missing DISCORD_TOKEN or CLIENT_ID in .env file');
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationCommands(config.clientId),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error('Error deploying commands:', error);
  }
})();