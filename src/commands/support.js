const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('support')
    .setDescription('Get information about supporting Bolt'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('Support Bolt')
      .setDescription('Want to support the Bolt Discord bot? Click the link below to sponsor our maintainer\'s GitHub account')
      .setColor(config.discord.embedColors.support)
      .addFields({
        name: 'Sponsor Link',
        value: '[Support us on GitHub Sponsors](https://github.com/sponsors/codewithtyler)'
      })
      .setFooter({
        text: 'Thank you for supporting Bolt! ❤️'
      });

    await interaction.reply({ embeds: [embed] });
  },
};