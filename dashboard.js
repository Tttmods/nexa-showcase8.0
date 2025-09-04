module.exports = function(env){
  const express = require('express');
  const session = require('express-session');
  const passport = require('passport');
  const DiscordStrategy = require('passport-discord').Strategy;
  const path = require('path');
  const fs = require('fs');
  const settings = JSON.parse(fs.readFileSync('./settings.json','utf8'));

  const app = express();
  app.set('view engine','ejs');
  app.set('views', path.join(__dirname, 'dashboard','views'));
  app.use(express.urlencoded({ extended:true }));
  app.use(express.json());
  app.use(session({ secret: process.env.SESSION_SECRET || 'secret', resave:false, saveUninitialized:false }));
  app.use(passport.initialize());
  app.use(passport.session());

  const scopes = ['identify','guilds'];
  passport.serializeUser((u,done)=>done(null,u));
  passport.deserializeUser((o,done)=>done(null,o));
  passport.use(new DiscordStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    scope: scopes
  }, (accessToken, refreshToken, profile, done)=> process.nextTick(()=>done(null, profile))));

  function checkAuth(req,res,next){ if (req.isAuthenticated && req.isAuthenticated()) return next(); res.redirect('/login'); }
  app.get('/login', passport.authenticate('discord', { scope: scopes }));
  app.get('/auth/callback', passport.authenticate('discord', { failureRedirect: '/' }), (req,res)=> res.redirect('/dashboard'));

  app.get('/', (req,res)=> res.render('home', { user: req.user, settings }));
  app.get('/dashboard', checkAuth, (req,res)=> res.render('dashboard', { user: req.user, settings }));
  app.post('/dashboard/settings', checkAuth, (req,res)=>{
    settings.welcomeMessage = req.body.welcomeMessage || settings.welcomeMessage;
    fs.writeFileSync('./settings.json', JSON.stringify(settings,null,2));
    res.redirect('/dashboard');
  });
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, ()=> console.log('Dashboard running on http://localhost:'+PORT));
};
