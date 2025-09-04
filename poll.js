module.exports = {
  name: "poll",
  description: "Create a poll: !poll Question | Option1 | Option2 ...",
  async run({ message, args }) {
    const joined = args.join(' ');
    const parts = joined.split('|').map(p=>p.trim()).filter(Boolean);
    if (parts.length < 2) return message.reply('Usage: !poll Question | Option1 | Option2');
    const question = parts[0];
    const options = parts.slice(1);
    const msg = await message.channel.send(`📊 **${question}**\n${options.map((o,i)=>`${i+1}. ${o}`).join('\n')}`);
    const emojis = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'];
    for (let i=0;i<options.length;i++) await msg.react(emojis[i]);
  }
};
