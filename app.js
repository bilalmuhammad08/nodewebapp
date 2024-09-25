const express = require('express');
const dotenv = require('dotenv').config();
const app = express();
const session = require('express-session')
// dotenv.config()
const path = require('path')
const db = require('./config/db')
const userRouter = require('./routes/userRouter.js')
const passport = require('./config/passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const passport = require('passport')
db()

app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        secure:false,
        httpOnly:true,
        maxAge:72*60*60*1000
    }
}))

app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next)=>{
    res.set('cache-control', 'no-store')
    next();
});

app.set("view engine", "ejs");
app.set("views",[path.join(__dirname,'views/users'),path.join(__dirname,'views/admin')])

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', userRouter)

app.listen(process.env.PORT, ()=> console.log('server is running on 8085'));

module.exports = app;