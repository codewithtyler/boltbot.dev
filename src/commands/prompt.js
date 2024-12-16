const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('prompt')
    .setDescription('Generate a Bolt link from your prompt')
    .addStringOption(option =>
      option
        .setName('text')
        .setDescription('The prompt text to encode')
        .setRequired(true)
    ),

  async execute(interaction) {
    const text = interaction.options.getString('text');
    const encodedText = encodeURIComponent(text);
    const boltUrl = `https://bolt.new?prompt=${encodedText}`;

    console.log(`Generating prompt embed for text: ${text.length > 50 ? text.substring(0, 50) + '...' : text}`);

    const embed = new EmbedBuilder()
      .setTitle('Open in Bolt')
      .setColor(config.discord.embedColors.primary)
      .setDescription(`[Click here to open your prompt in Bolt](${boltUrl})`);

    return interaction.editReply({ embeds: [embed] });
  },
};