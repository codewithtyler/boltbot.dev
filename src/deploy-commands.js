const { REST, Routes } = require('discord.js');
const config = require('./config');
const { loadCommands } = require('./utils/loadCommands');

// Validate required environment variables
if (!config.token || !config.clientId) {
  console.error('Error: Missing DISCORD_TOKEN or CLIENT_ID in environment variables');
  process.exit(1);
}

const client = { commands: new Map() };
const commands = [];

loadCommands(client);

// Convert commands to JSON for registration
for (const command of client.commands.values()) {
  commands.push(command.data.toJSON());
}

const rest = new REST().setToken(config.token);

(async () => {
  try {
    console.log('\nDeploying slash commands...');
    console.log(`Client ID: ${config.clientId}`);
    console.log('Scopes: bot, applications.commands');
    console.log('Required Permissions: Send Messages (2048)\n');

    await rest.put(
      Routes.applicationCommands(config.clientId),
      { body: commands },
    );

    console.log('✅ Commands deployed successfully!');
    console.log('\nAvailable commands:');
    commands.forEach(cmd => {
      console.log(`- /${cmd.name}: ${cmd.description}`);
    });
    console.log('\nNote: It may take up to 1 hour for commands to show up in all servers.');
  } catch (error) {
    console.error('\n❌ Error deploying commands:');
    if (error.code === 50001) {
      console.error('Bot token may be invalid or missing required scopes');
    } else if (error.code === 50013) {
      console.error('Bot is missing required permissions');
    } else {
      console.error(error);
    }
    process.exit(1);
  }
})();