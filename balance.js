module.exports = {
  name: "balance",
  description: "Check balance",
  async run({ message, db }) {
    const row = db.prepare('SELECT coins FROM users WHERE id=?').get(message.author.id);
    const coins = (row && row.coins) ? row.coins : 0;
    message.reply('💰 Balance: ' + coins);
  }
};
