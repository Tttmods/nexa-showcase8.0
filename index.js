/**
 * NexaStudios Bot + Dashboard (Single File Edition)
 * 🚀 Bot + Express Dashboard in one file
 */

const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN; // 🔑 Set this in your Railway/host env

// -------------------- SETTINGS --------------------
const settingsFile = path.join(__dirname, "settings.json");
if (!fs.existsSync(settingsFile)) {
  fs.writeFileSync(settingsFile, JSON.stringify({
    welcomeMessage: "Welcome to NexaStudios Discord!",
    copyright: "© NexaStudios 2025"
  }, null, 2));
}
const loadSettings = () => JSON.parse(fs.readFileSync(settingsFile, "utf8"));
const saveSettings = (newSettings) => fs.writeFileSync(settingsFile, JSON.stringify(newSettings, null, 2));

// -------------------- DISCORD BOT --------------------
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once("ready", () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.on("guildMemberAdd", member => {
  const settings = loadSettings();
  member.send(settings.welcomeMessage).catch(() => {});
});

client.on("messageCreate", msg => {
  if (msg.content === "!ping") {
    msg.reply("Pong! © NexaStudios");
  }
});

if (!BOT_TOKEN) {
  console.error("❌ No BOT_TOKEN provided! Please set process.env.BOT_TOKEN");
} else {
  client.login(BOT_TOKEN);
}

// -------------------- DASHBOARD --------------------
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve CSS directly
app.get("/style.css", (req, res) => {
  res.type("text/css").send(`
    body {
      font-family: Arial, sans-serif;
      text-align: center;
      margin: 40px;
      background: #0d1117;
      color: #f0f6fc;
    }
    h1 { color: #58a6ff; }
    form { margin: 20px auto; width: 300px; }
    input { width: 100%; padding: 8px; margin: 10px 0; }
    button {
      padding: 8px 16px;
      background: #238636;
      color: white;
      border: none;
      cursor: pointer;
    }
    button:hover { background: #2ea043; }
  `);
});

// dashboard page
app.get("/", (req, res) => {
  const settings = loadSettings();
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Nexa Dashboard</title>
      <link rel="stylesheet" href="/style.css">
    </head>
    <body>
      <h1>NexaStudios Dashboard</h1>
      <form action="/update" method="POST">
        <label>Welcome Message:</label>
        <input type="text" name="welcomeMessage" value="${settings.welcomeMessage}" />
        <button type="submit">Save</button>
      </form>
      <footer>${settings.copyright}</footer>
    </body>
    </html>
  `);
});

// update settings
app.post("/update", (req, res) => {
  const newSettings = {
    welcomeMessage: req.body.welcomeMessage || "Welcome!",
    copyright: "© NexaStudios 2025"
  };
  saveSettings(newSettings);
  res.redirect("/");
});

// start express
app.listen(PORT, () => console.log(`🌐 Dashboard running at http://localhost:${PORT}`));

// -------------------- KEEP ALIVE --------------------
setInterval(() => {
  fetch("http://localhost:" + PORT)
    .then(() => console.log("🔄 Keep-alive ping sent"))
    .catch(() => {});
}, 3 * 60 * 1000);
