module.exports = {
  name: "kick",
  description: "Kick member",
  async run({ message }) {
    if (!message.member.permissions.has('KickMembers')) return message.reply('No permission');
    const m = message.mentions.members.first();
    if (!m) return message.reply('Mention');
    await m.kick().catch(e=>message.reply('Failed: '+e.message));
    message.reply('Kicked '+m.user.tag);
  }
};
