module.exports = {
  name: "ping",
  description: "Latency",
  async run({ message }) {
    const m = await message.reply('Pinging...');
    m.edit('🏓 Pong! ' + (m.createdTimestamp - message.createdTimestamp) + 'ms');
  }
};
