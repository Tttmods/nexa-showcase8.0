module.exports = function(env){
  const fs = require('fs');
  const path = require('path');
  const Database = require('better-sqlite3');
  const dbPath = env.DATABASE_PATH || './database/nexa.sqlite';
  const dbdir = path.dirname(dbPath);
  if (!fs.existsSync(dbdir)) fs.mkdirSync(dbdir, { recursive: true });
  const db = new Database(dbPath);

  // simple tables
  db.prepare('CREATE TABLE IF NOT EXISTS guilds (id TEXT PRIMARY KEY, prefix TEXT, welcome TEXT)').run();
  db.prepare('CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, coins INTEGER)').run();

  const { Client, GatewayIntentBits, Collection } = require('discord.js');
  const settings = JSON.parse(fs.readFileSync('./settings.json','utf8'));
  const PREFIX = process.env.PREFIX || settings.prefix || '!';

  const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });
  client.commands = new Collection();

  // load commands
  const load = (dir) => {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);
    for (const it of items){
      const full = path.join(dir, it);
      if (fs.lstatSync(full).isDirectory()){ load(full); continue; }
      if (!it.endsWith('.js')) continue;
      try {
        const cmd = require(full);
        if (cmd && cmd.name) client.commands.set(cmd.name, cmd);
      } catch(e){ console.error('Load cmd error', full, e); }
    }
  };
  load(path.join(__dirname,'commands'));

  client.on('ready', ()=>{
    console.log('Bot ready as', client.user.tag, 'Commands:', client.commands.size);
    client.user.setActivity(PREFIX + 'help | NexaEverything');
  });

  client.on('guildMemberAdd', (member) => {
    try {
      const row = db.prepare('SELECT welcome FROM guilds WHERE id=?').get(member.guild.id);
      const welcome = (row && row.welcome) ? row.welcome : settings.welcomeMessage;
      member.send(welcome).catch(()=>{});
    } catch(e){}
  });

  client.on('messageCreate', async message => {
    if (message.author.bot || !message.guild) return;
    // prefix per guild
    const row = db.prepare('SELECT prefix FROM guilds WHERE id=?').get(message.guild.id);
    const prefix = (row && row.prefix) ? row.prefix : PREFIX;
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/\s+/);
    const name = args.shift().toLowerCase();
    const cmd = client.commands.get(name);
    if (!cmd) return;
    try { await cmd.run({ client, message, args, db, settings }); }
    catch(e){ console.error('cmd error', e); message.reply('❌ Command error'); }
  });

  const token = env.BOT_TOKEN;
  if (!token) console.error('Missing BOT_TOKEN'); else client.login(token);
  // export client and db for modules
  module.exports.client = client;
  module.exports.db = db;
};
