const { EmbedBuilder } = require('discord.js');
module.exports = {
  name: "help",
  description: "Show commands",
  async run({ client, message }) {
    const list = [...new Set([...client.commands.values()])];
    const eb = new EmbedBuilder().setTitle('Commands').setDescription(list.slice(0,50).map(c=>c.name+' - '+(c.description||'')).join('\n'));
    message.reply({ embeds: [eb] });
  }
};
