module.exports = {
  name: "ban",
  description: "Ban member",
  async run({ message }) {
    if (!message.member.permissions.has('BanMembers')) return message.reply('No permission');
    const m = message.mentions.members.first();
    if (!m) return message.reply('Mention');
    await m.ban().catch(e=>message.reply('Failed: '+e.message));
    message.reply('Banned '+m.user.tag);
  }
};
