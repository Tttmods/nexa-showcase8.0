module.exports = {
  name: "ticket",
  description: "Open a support ticket: !ticket <reason>",
  async run({ message, args }) {
    const reason = args.join(' ') || 'No reason provided';
    const ch = await message.guild.channels.create({ name: `ticket-${message.author.username}`, reason: 'Ticket' }).catch(()=>null);
    if (!ch) return message.reply('Could not create ticket channel.');
    ch.send(`<@${message.author.id}> opened a ticket. Reason: ${reason}`);
    message.reply('Ticket created: ' + (ch ? `<#${ch.id}>` : 'error'));
  }
};
