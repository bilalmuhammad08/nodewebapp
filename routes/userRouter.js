const express = require('express')
const router = express.Router()
const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userController = require('../controllers/user/userController')

router.get('/pageNotFound', userController.pageNotFound)
router.get('/',userController.loadHomepage)
router.get('/signup',userController.laodsignup);
router.post('/signup', userController.signup)
router.post('/verify-otp', userController.verifyOtp)

router.get('/auth/google', passport.authenticate('google', {scope:['profile', 'email']}));
router.get('/auth/google/callbak', passport.authenticate('google', {failureRedirect:'/signup'}), (req, res) =>{
    res.redirect('/')
})

router.get('/login', userController.laodLogin);
router.post('/login', userController.login)


module.exports = router