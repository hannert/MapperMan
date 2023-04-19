const auth = require('../auth')
// const User = require('../models/user-model')
const Account = require('../db/schemas/account-schema')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const dotenv = require('dotenv')
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
                mapAccess: existingUser.mapAccess
            }
        })

    } catch (err) {
        console.error(err);
        res.status(500).send();
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
        const { email, newpassword, passwordVerify } = req.body;
        console.log("Email and new passwords: " + email + " " + newpassword + " " + passwordVerify);
        if (!email || !newpassword || !passwordVerify){
            console.log("Nope");
            return res
                .status(400)
                .json({errorMessage: "Please enter all required fields." });
        }
        console.log("All fields filled out");
        if (newpassword.length < 8){
            return res
                .status(400)
                .json({errorMessage: "Please enter a new password of at least 8 characters. "});
        }
        console.log("Password long enough.");
        if (newpassword !== passwordVerify){
            return res
                .status(400)
                .json({
                    errorMessage: "Passwords do not match."
                });
        }
        console.log("Both passwords match");
        const existingUser = await Account.findOne({ email: email });
        console.log("existingUser: " + existingUser);
        if (!existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "There is no account in the database."
                })
        }
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const newpasswordHash = await bcrypt.hash(newpassword, salt);
        console.log("passwordHash: " + newpasswordHash);
        existingUser.passwordHash = newpasswordHash;
        await existingUser.save();

        res.status(200).json({success: true, 
            user: {
            username: existingUser.username,
            passwordHash: newpasswordHash,
            email: existingUser.email,             
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,  
            mapsOwned: existingUser.mapsOwned,
            mapAccess: existingUser.mapAccess
        }
    });

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}
registerUser = async (req, res) => {
    console.log("REGISTERING USER IN BACKEND");
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

module.exports = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword
}
