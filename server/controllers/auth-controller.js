const auth = require('../auth')
// const User = require('../models/user-model')
const Account = require('../db/schemas/account-schema')
const Token = require('../db/schemas/token-schema')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const dotenv = require('dotenv')
const crypto = require('crypto')
const sendEmail = require('../nodemailer/sendMail.js')
dotenv.config()

signToken = (userId) => {
    return jwt.sign({
        userId: userId
    }, process.env.JWT_SECRET);
}

getLoggedIn = async (req, res) => {
    try {
        let userId = auth.verifyUser(req);
        if (!userId) {
            return res.status(200).json({
                loggedIn: false,
                user: null,
                errorMessage: "?"
            })
        }

        const loggedInUser = await Account.findOne({ _id: userId });
        console.log("loggedInUser: " + loggedInUser);

        return res.status(200).json({
            loggedIn: true,
            user: loggedInUser
        })

    } catch (err) {
        console.log("err: " + err);
        res.json(false);
    }
}

loginUser = async (req, res) => {
    console.log("loginUser");
    console.log(req.body);
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }

        const existingUser = await Account.findOne({ email: email });
        console.log("existingUser: " + existingUser);
        if (!existingUser) {
            return res
                .status(401)
                .json({
                    errorMessage: "Wrong email or password provided."
                })
        }

        console.log("provided password: " + password);
        const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
        if (!passwordCorrect) {
            console.log("Incorrect password");
            return res
                .status(401)
                .json({
                    errorMessage: "Wrong email or password provided."
                })
        }else{
            console.log("Correct password");
        }

        // LOGIN THE USER
        const token = signToken(existingUser._id);
        console.log(token);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: true
        }).status(200).json({
            success: true,
            user: {
                username: existingUser.username,
                passwordHash: existingUser.passwordHash,
                email: existingUser.email,             
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,  
                mapsOwned: existingUser.mapsOwned,
                mapAccess: existingUser.mapAccess,
                id: existingUser._id
            }
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ errorMessage: "Server error" });
    }
}

logoutUser = async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: true,
        sameSite: "none"
    }).status(200).json({
        success: true,
    });
}
forgotPassword = async (req, res) => {
    console.log("CHANGING PASSWORD");
    try {
        const { userId, password, passwordVerify } = req.body;
        console.log(userId);
        console.log("New passwords: " + password + " " + passwordVerify);
        if (!password || !passwordVerify){
            console.log("Nope");
            return res
                .status(400)
                .json({errorMessage: "Please enter all required fields." });
        }
        console.log("All fields filled out");
        if (password.length < 8){
            return res
                .status(400)
                .json({errorMessage: "Please enter a new password of at least 8 characters. "});
        }
        console.log("Password long enough.");
        if (password !== passwordVerify){
            return res
                .status(400)
                .json({
                    errorMessage: "Passwords do not match."
                });
        }
        console.log("Both passwords match");
        
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const newpasswordHash = await bcrypt.hash(password, salt);
        console.log("passwordHash: " + newpasswordHash);
        const existingUser = await Account.findById(userId);
        console.log("existingUser: " + existingUser);
        if (!existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this email address does not exist."
                })
        }
        existingUser.passwordHash = newpasswordHash;
        await existingUser.save();
        const token = await Token.findOne({
            userId: existingUser._id,
            token: req.params.token
        })
        res.status(200).json({success: true, 
            user: {
            username: existingUser.username,
            passwordHash: newpasswordHash,
            email: existingUser.email,             
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,  
            mapsOwned: existingUser.mapsOwned,
            mapAccess: existingUser.mapAccess,
            token: null
        }
    });

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}
registerUser = async (req, res) => {
    console.log("REGISTERING USER IN BACKEND");
    var re = /^\S+@\S+\.\S+$/;
    try {
        console.log(req.body);
        const { firstName, lastName, username, email, password, passwordVerify } = req.body;
        console.log("create user: " + firstName + " " + lastName + " " + email + " " + username + " " + password + " " + passwordVerify);
        if (!firstName || !lastName || !username || !email || !password || !passwordVerify) {
            console.log("Why?");
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        if(re.test(email) === false) {
            return res
            .status(400)
            .json({ errorMessage: "Email is not valid." });
        }
        console.log("all fields provided");
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }
        console.log("password long enough");
        if (password !== passwordVerify) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter the same password twice."
                })
        }
        console.log("password and password verify match");
        const existingUser = await Account.findOne({ email: email });
        console.log("existingUser: " + existingUser);
        if (existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this email address already exists."
                })
        }
        
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);
        console.log("passwordHash: " + passwordHash);
        const mapsOwned = []
        const mapAccess = []
        const newUser = new Account({firstName, lastName, username, email, passwordHash, mapsOwned, mapAccess});
        const savedUser = await newUser.save();
        console.log("new user saved: " + savedUser._id);

        // LOGIN THE USER
        const token = signToken(savedUser._id);
        console.log("token:" + token);

        await res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                username: savedUser.username,  
                email: savedUser.email,
                passwordHash: savedUser.passwordHash,
                mapsOwned: savedUser.mapsOwned,
                mapAccess: savedUser.mapAccess   
            }
        })
        console.log("token sent");

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

sendVerification = async (req, res) => {
    const {email} = req.body;

    try {
        const send_to = email;
        const existingUser = await Account.findOne({ email: email });
        console.log("existingUser: " + existingUser);
        if (!existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "There is no account with this email."
                })
        }
        const token = crypto.randomBytes(20).toString("hex")
        let t = await Token.findOne({userId: existingUser._id});
        if (!t){
            t = await new Token({
                userId: existingUser._id,
                token: token
            }).save()
        }
        const send_from = "verifymapperman@gmail.com"
        const reply_to = email;
        const subject = "Verify your email for password reset."
        const message = `
            <p>Hi! You have requested to do a password reset. Please click <a href=${process.env.FRONTEND_URL}changePassword/${existingUser._id}/${t.token}>here</a> to verify and complete it!</p>
            <p>Regards, </p>
            <p>Mapperman team</p>`
        await sendEmail(subject, message, send_to, send_from, reply_to)
        console.log("Email sent")
        return res.status(200).json({success: true})
        
    }   catch(error){
        console.error(error);
        res.status(500).send();
    }

}
module.exports = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    sendVerification
}
