const express = require('express');
const env = require('dotenv').config();
const app = express();
const db = require('./config/db')
db()



app.listen(process.env.PORT, ()=> console.log('server is running on 8085'));

module.exports = app;