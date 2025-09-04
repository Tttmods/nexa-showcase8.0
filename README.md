NexaEverything - All-in-One NexaStudios Bot (SQLite)

This repo is a scaffold for an extensive Discord bot + dashboard using SQLite for persistence.

Quickstart:
1. Copy .env.example -> .env and fill in values.
2. npm install
3. npm start

Notes:
- Dashboard OAuth requires Discord app credentials and callback URL set in Developer Portal.
- Music features require ffmpeg and extra libraries; not included out-of-the-box.
- This scaffold provides many sample commands and modules; expand as needed.

---

## 🚀 Deploy on Railway with GitHub

1. Push this folder to a GitHub repo:

   ```bash
   git init
   git add .
   git commit -m "Initial commit NexaEverything"
   git branch -M main
   git remote add origin https://github.com/YOURNAME/nexa-everything.git
   git push -u origin main
   ```

2. Go to [Railway](https://railway.app), create a new project → Deploy from GitHub Repo.

3. Add Environment Variables in Railway dashboard:
   - `BOT_TOKEN` = your Discord bot token
   - `CLIENT_ID` = your Discord App Client ID
   - `CLIENT_SECRET` = your Discord App Client Secret
   - `CALLBACK_URL` = `https://yourapp.up.railway.app/auth/callback`
   - `SESSION_SECRET` = random string
   - `DATABASE_PATH` = `./database/nexa.sqlite`

4. Deploy → Railway will auto-detect and run with Procfile/Dockerfile.

5. Invite your bot to Discord using:
   ```
   https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&scope=bot%20applications.commands&permissions=8
   ```
