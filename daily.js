module.exports = {
  name: "daily",
  description: "Daily coins",
  async run({ message, db }) {
    const row = db.prepare('SELECT coins FROM users WHERE id=?').get(message.author.id);
    let coins = (row && row.coins) ? row.coins : 0;
    coins += 100;
    db.prepare('INSERT OR REPLACE INTO users (id, coins) VALUES (?,?)').run(message.author.id, coins);
    message.reply('You received 100 coins! New balance: ' + coins);
  }
};
