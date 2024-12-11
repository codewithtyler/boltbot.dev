const { REST, Routes } = require('discord.js');
const config = require('./config');
const { loadCommands } = require('./utils/loadCommands');

const commands = [];
const client = { commands: new Map() };
loadCommands(client);

// Convert commands to JSON for registration
for (const command of client.commands.values()) {
  commands.push(command.data.toJSON());
}

const rest = new REST().setToken(config.token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationCommands(config.clientId),
      { body: commands },
    );

    console.log('Successfully registered global application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();