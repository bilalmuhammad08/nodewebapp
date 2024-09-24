const express = require('express');
const env = require('dotenv').config();
const app = express();
const path = require('path')
const db = require('./config/db')
const userRouter = require('./routes/userRouter.js')
db()

app.use(express.json())
app.use(express.urlencoded({extended:true}));


app.set("view engine", "ejs");
app.set("views",[path.join(__dirname,'views/users'),path.join(__dirname,'views/admin')])

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', userRouter)

app.listen(process.env.PORT, ()=> console.log('server is running on 8085'));

module.exports = app;