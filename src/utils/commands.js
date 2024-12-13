const { REST, Routes } = require('discord.js');
const config = require('../config');
const { loadCommands } = require('./loadCommands');

async function deployCommands(client) {
    try {
        const commands = [];

        // Convert commands to JSON for registration
        for (const command of client.commands.values()) {
            commands.push(command.data.toJSON());
        }

        const rest = new REST().setToken(config.token);

        console.log('\nDeploying slash commands...');

        await rest.put(
            Routes.applicationCommands(config.clientId),
            { body: commands },
        );

        console.log('✅ Commands deployed successfully!');
        console.log('\nAvailable commands:');
        commands.forEach(cmd => {
            console.log(`- /${cmd.name}: ${cmd.description}`);
        });
    } catch (error) {
        console.error('\n❌ Error deploying commands:');
        if (error.code === 50001) {
            console.error('Bot token may be invalid or missing required scopes');
        } else if (error.code === 50013) {
            console.error('Bot is missing required permissions');
        } else {
            console.error(error);
        }
        throw error; // Propagate error to caller
    }
}

module.exports = { deployCommands };