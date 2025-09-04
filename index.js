require('dotenv').config();
const path = require('path');
const fs = require('fs');
console.log('Starting NexaEverything...');
// start bot and dashboard
require('./bot')(process.env);
require('./dashboard')(process.env);
