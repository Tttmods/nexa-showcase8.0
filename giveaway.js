module.exports = {
  name: "giveaway",
  description: "Start a simple giveaway: !giveaway <seconds> <prize>",
  async run({ message, args }) {
    const time = parseInt(args[0]);
    const prize = args.slice(1).join(' ');
    if (!time || !prize) return message.reply('Usage: !giveaway <seconds> <prize>');
    const msg = await message.channel.send(`🎉 Giveaway for **${prize}**! React with 🎉 to enter. Ends in ${time}s`);
    await msg.react('🎉');
    setTimeout(()=>{
      const users = msg.reactions.cache.get('🎉')?.users.cache.filter(u=>!u.bot).map(u=>u.id) || [];
      if (!users.length) return message.channel.send('No entries.');
      const winner = users[Math.floor(Math.random()*users.length)];
      message.channel.send(`🎉 Winner: <@${winner}>! Prize: **${prize}**`);
    }, time*1000);
  }
};
