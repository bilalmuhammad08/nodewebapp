
const User = require('../../models/userSchema')
const env =require('dotenv').config();
const nodeMailer = require('nodemailer')
const bcrypt = require('bcrypt')


const laodsignup = async(req, res) =>{
    try {
        return res.render('signup')
    } catch (error) {
        console.log("Home page not Loading", error)
        res.status(500).send('Server Error')
    }
}
const laodShopping = async (req, res) =>{
    try {
        return res.render('shop')
    } catch (error) {
        console.log('Shopping page not laoding', error)
        res.status(500).send('Server Error')
    }
}

//  Error page (Page Not Found)
const pageNotFound = async (req, res) => {
    try {
        res.render("page-404")
    } catch (error) {
        res.redirect("/pageNotFound")
    }
}


const loadHomepage = async (req, res) => {
    try{
        return res.render("home")
    }catch(error){
        console.log("Home page not found")
        res.status(500).send("Server error")
    }
}


function generateOtp(){
    return Math.floor(100000 + Math.random()*900000).toString()
}

async function sendVerificationEmail(email, otp){
    try {
        const transporter = nodeMailer.createTransport({

            service:'gmail',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:process.env.NODEMAILER_EMAIL,
                pass:process.env.NODEMAILER_PASSWORD
            }
        })

        const info = await transporter.sendMail({
            from:process.env.NODEMAILER_EMAIL,
            to:email,
            subject:"Verify your account",
            text:`Your OTP is ${otp}`,
            html:`<b>Your OTP:${otp}</b>`
        })
        return info.accepted.length >0
        
    } catch (error) {
        console.error("Error sending mail", error)
        return false;
    }
}

const signup = async (req, res) =>{
    
    try {
        const {name, phone, email,password, cPassword} = req.body
        
        if(password !== cPassword){
            return res.render('signup', {message:"Password not match"})
        }

        const findUser = await User.findOne({email})
        if(findUser){
            return res.render('signup', {message:"This email already exists"});
        }

        const otp = generateOtp();

        const emailSent = await sendVerificationEmail(email, otp)
        if(!emailSent){
            return res.json("email-error")
        }
        req.session.userOtp = otp;
        req.session.userData = {name, phone, email, password};

        res.render("verify-otp")
        console.log("OTP Send", otp)

    } catch (error) {
        console.error('Signup error', error)
        res.redirect('/pageNotFound')
    }
}

const securePassword = async (password) =>{
    try {

        const passwordHash = await bcrypt.hash(password,10)
        return passwordHash;
        
    } catch (error) {
        
    }
}

const verifyOtp = async (req, res) => {
    try {
        
        const {otp} = req.body;
        console.log(otp);

        if(otp===req.session.userOtp){
            const user = req.session.userData
            const passwordHash = await securePassword(user.password);

            const saveUserData = new User({
                name:user.name,
                email:user.email,
                phone:user.phone,
                password:passwordHash
            })

            await saveUserData.save();
            req.session.user = saveUserData._id;
            res.json({success:true, redirectUrl:"/"})
        }else{
            res.status(400).json({success: false, message:"Invalid OTP, Please try again"})
        }

    } catch (error) {
        console.error('Error verifying OTP', error)
        res.status(500).json({succes:false, message:"An error occured"})
    }
}
const laodLogin = async (req, res) =>{
    try {

        if(!req.session.user){
            return res.render('login')
        }else{
            res.redirect('/')
        }
        
    } catch (error) {
        res.redirect('/pageNotFound')   
        
    }
}

const login = async (req, res) =>{
    try {

        const {email, password} = req.body;

        const findUser = await User.findOne({isAdmin:0, email:email});
        if(findUser){
            return res.render('login', {message:"User not Found"})
        }
        if(findUser.isBlocked){
            return res.render('login', {message:"User is Blocked by Admin"})
        }

        const passwordMatch = await bcrypt.compare(password, findUser.password)

        if(!passwordMatch){
            return res.render('login', {message:"Incorrect Password"})
        }

        req.session.user = findUser._id
        res.redirect('/')
        
    } catch (error) {
        console.error("Loging error", error)
        res.render('login', {message:'Loging Failed, Try again later'})
        
    }
}


module.exports = {
    loadHomepage,
    pageNotFound,
    laodsignup,
    laodShopping,
    signup,
    verifyOtp,
    laodLogin,
    login
}