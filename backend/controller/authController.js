import user from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import transporter from '../config/nodemailer.js';
import CryptoJS from "crypto-js";
import share from '../models/shareModel.js'
import mongoose from 'mongoose';
import sendFunc from '../Functions/sendFunc.js';
import recievedFunc from '../Functions/recievedFunc.js';
import tokenCollection from '../models/tokensCollections.js';
import speakeasy from "speakeasy"
import qrCode from "qrcode"
import { OAuth2Client } from "google-auth-library"
import crypto from "crypto"
import {
    generateRegistrationOptions, verifyRegistrationResponse, generateAuthenticationOptions, verifyAuthenticationResponse,
} from '@simplewebauthn/server';

import regesterChallenge from '../models/regesterModel.js';

import loginChallenge from '../models/loginModel.js'



const generateToken = (userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' })
    return token;
}

const register = async (req, res) => {
    const colors = [
        "#FF6F61",
        "#1E90FF",
        "#32CD32",
        "#FFD700",
        "#FF1493",
        "#8A2BE2",
        "#FF8C00",
        "#20B2AA",
        "#FF4500",
        "#6A5ACD",
        "#00CED1",
        "#DC143C",
        "#2E8B57",
        "#FF6347",
        "#4682B4",
        "#DAA520",
        "#9932CC",
        "#B22222",
        "#3CB371",
        "#FF00FF",
        "#708090"
    ];

    try {
        const { name, email, password } = req.body;

        const existEmail = await user.findOne({ email });

        if (existEmail) {
            throw new Error("Email is already registered.")
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const userDB = new user({ _id: uuid().toString(), name, email, password: hashPassword, photoURL: colors[Math.floor(Math.random() * 21)] })

        await userDB.save();

        return res.json({ success: true, message: "User registered successfully." })

    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, type: "register" })
    }
}

const userlogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userExists = await user.findOne({ email }).lean();

        if (!userExists) {
            throw new Error("Invalid credentials.");
        }

        const passwordMatch = await bcrypt.compare(password, userExists.password);

        if (!passwordMatch) {
            throw new Error("Incorrect password.");
        }

        if (userExists.provider === "google") {
            throw new Error("This account was created with Google. Sign in with Google to continue.")
        }

        if (!userExists.is2FA) { //is2FA = false
            const token = generateToken(userExists._id);

            const cookiesOption = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? "none" : "lax",
                maxAge: 30 * 24 * 60 * 60 * 1000
            }

            res.cookie("token", token, cookiesOption);

            let newAllPassword = [];

            if (userExists.AllPassword.length !== 0) {
                newAllPassword = userExists.AllPassword.map((currPass) => {
                    if (currPass.Doctype === "card") {
                        let decryptCardNumber = CryptoJS.AES.decrypt(currPass.card_number, process.env.CRYPTO_SECRET_KEY).toString(CryptoJS.enc.Utf8);
                        let decryptCardHolderName = CryptoJS.AES.decrypt(currPass.card_holder_name, process.env.CRYPTO_SECRET_KEY).toString(CryptoJS.enc.Utf8)
                        return { ...currPass, card_number: decryptCardNumber, card_holder_name: decryptCardHolderName }
                    } else {
                        const decryptPassword = CryptoJS.AES.decrypt(currPass.password, process.env.CRYPTO_SECRET_KEY).toString(CryptoJS.enc.Utf8)
                        return { ...currPass, password: decryptPassword }
                    }
                })
            }

            const userDetails = {
                email: userExists.email,
                name: userExists.name,
                photoURL: userExists.photoURL,
                _id: userExists._id,
                collections: userExists.collections,
                AllPassword: newAllPassword,
                is2FA: userExists.is2FA,
                isPassKey: userExists.isPassKey,
                plan_type: userExists.plan_type,
                plan_expiry: userExists.plan_expiry
            }

            const sharedArr = await share.find({ $or: [{ from: userExists._id }, { to: userExists._id }] }).lean();

            //yeah recieved wala hai
            const recieved = userExists.recieved;

            const recievedResult = await recievedFunc(userExists, sharedArr);

            //yeah send wala hai
            const send = userExists.send;

            const sendResult = await sendFunc(userExists, sharedArr);


            return res.json({ success: true, message: "User logged in successfully.", user: userDetails, recieved, send, recievedResult, sendResult })
        }

        const userDetails = {
            _id: userExists._id,
            email: userExists.email,
            name: userExists.name,
            photoURL: userExists.photoURL,
            is2FA: userExists.is2FA,
            isPassKey: userExists.isPassKey,
            plan_type: userExists.plan_type,
            plan_expiry: userExists.plan_expiry
        }

        return res.json({ success: true, message: "User logged in successfully.", user: userDetails })
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }
}

const isLoggedIn = async (req, res) => {
    try {
        const accessToken = req.cookies.token;

        if (!accessToken) {
            throw new Error("Token is Missing.");
        }

        const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);

        if (!decodedToken) {
            throw new Error("Authentication token is missing.");
        }

        const userId = decodedToken.id;

        const userDB = await user.findOne({ _id: userId }).lean();

        if (!userDB) {
            throw new Error("User not found.");
        }

        let newAllPassword = [];

        if (userDB.AllPassword.length !== 0) {
            newAllPassword = userDB.AllPassword.map((currPass) => {
                if (currPass.Doctype === "card") {
                    let decryptCardNumber = CryptoJS.AES.decrypt(currPass.card_number, process.env.CRYPTO_SECRET_KEY).toString(CryptoJS.enc.Utf8);
                    let decryptCardHolderName = CryptoJS.AES.decrypt(currPass.card_holder_name, process.env.CRYPTO_SECRET_KEY).toString(CryptoJS.enc.Utf8)
                    return { ...currPass, card_number: decryptCardNumber, card_holder_name: decryptCardHolderName }
                    // return { ...currPass.toObject(), card_number: decryptCardNumber, card_holder_name: decryptCardHolderName }
                } else {
                    const decryptPassword = CryptoJS.AES.decrypt(currPass.password, process.env.CRYPTO_SECRET_KEY).toString(CryptoJS.enc.Utf8)
                    return { ...currPass, password: decryptPassword }
                    // return { ...currPass.toObject(), password: decryptPassword }
                }
            })
        }

        const userDetails = {
            email: userDB.email,
            name: userDB.name,
            photoURL: userDB.photoURL,
            _id: userDB._id,
            collections: userDB.collections,
            AllPassword: newAllPassword,
            disappear: userDB.disappear,
            is2FA: userDB.is2FA,
            isPassKey: userDB.isPassKey,
            plan_type: userDB.plan_type,
            plan_expiry: userDB.plan_expiry
        }

        //yaha se shared docs ka filteration start hai
        const sharedArr = await share.find({ $or: [{ from: userDB._id }, { to: userDB._id }] }).lean();

        //yeah recieved wala hai
        const recieved = userDB.recieved;

        const recievedResult = await recievedFunc(userDB, sharedArr);

        //yeah send wala hai
        const send = userDB.send;

        const sendResult = await sendFunc(userDB, sharedArr);

        return res.json({ success: true, message: "User is logged in.", user: userDetails, recieved, send, recievedResult, sendResult })

    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
}

const Logout = async (req, res) => {
    try {
        const cookiesOption = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        }

        res.clearCookie("token", cookiesOption);

        return res.json({ success: true, message: "User is Logout" })
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }
}

const delUser = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction()
    try {
        const { email } = req.params;

        const userDB = await user.findOne({ email });

        if (!userDB) {
            throw new Error("User not found.");
        }

        //current user se related jitne bhi docs share kiye the aur jitne bhi recieved sab delete
        await share.deleteMany({ $or: [{ from: userDB._id }, { to: userDB._id }] }, { session });

        //yeah send array mai se user ko delete kiya
        const sendId = (userDB.send || []).map((ele) => ele.userId);
        await user.updateMany({ _id: { $in: sendId } }, { $pull: { recieved: { userId: userDB._id } } }, { session })

        //yeaha recieved array mai se user ko delete kiya
        const recievedId = (userDB.recieved || []).map((ele) => ele.userId);
        await user.updateMany({ _id: { $in: recievedId } }, { $pull: { send: { userId: userDB._id } } }, { session });

        //delete token docs
        await tokenCollection.deleteOne({ _id: userDB._id }, { session })

        await user.deleteOne({ _id: userDB._id }, { session })

        const Ids = new Set([...sendId, ...recievedId]);

        await session.commitTransaction()
        await session.endSession();
        return res.json({ success: true, message: "User deleted successfully.", Ids: [...Ids] })
    } catch (error) {
        await session.abortTransaction()
        await session.endSession()
        return res.status(400).json({ success: false, message: error.message });
    }
}

const sendOpt = async (req, res) => {
    try {
        const { email } = req.body;

        const userDB = await user.findOne({ email });

        if (!userDB) {
            throw new Error("User not found");
        }

        if (userDB.provider === "google") {
            throw new Error("This account uses Google Sign-In. Please sign in with Google.");
        }

        const otp = Math.floor(100000 + Math.random() * 900000);

        await user.updateOne({ _id: userDB._id }, { otp, otpExpireAt: new Date(Date.now() + 1000 * 60 * 5) })

        await transporter.sendMail({
            from: 'PassOP Security Team <passop7021@gmail.com>',
            to: email,
            subject: "🔑 PassOP One-Time Password (OTP) Code",
            html: `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background-color: #f6f9fc; margin: 0; padding: 0;">
  <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <div style="background: green; color: white; text-align: center; padding: 20px;">
      <h1 style="margin: 0; font-size: 22px;">PassOP Verification Code</h1>
    </div>
    <div style="padding: 20px; color: #333333;">
      <p>Hello,</p>
      <p>We received a request to reset your password. Use the following OTP code to proceed:</p>
      <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 28px; letter-spacing: 5px; font-weight: bold; border-radius: 6px; margin: 20px 0;">${otp}</div>
      <p>This code will expire in <b>5 minutes</b>. If you didn’t request this, you can safely ignore this email.</p>
      <p>Thanks,<br/>The PassOP Team</p>
    </div>
    <div style="font-size: 12px; text-align: center; color: #888888; padding: 15px;">
      &copy; ${new Date().getFullYear()} PassOP. All rights reserved.
    </div>
  </div>
</body>
</html>`
        });

        return res.json({ success: true, message: "Opt Send Successfully" });

    } catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { otp, email } = req.body;

        if (!otp) {
            throw new Error("OTP is Missing");
        }

        const userDB = await user.findOne({ email })

        if (!userDB) {
            throw new Error("User not found")
        }

        if (userDB.otp && userDB.otp !== otp) {
            throw new Error("Invalid otp.")
        }

        if (new Date() > userDB.otpExpireAt) {
            throw new Error("OTP is expired.")
        }

        await user.findOneAndUpdate({ _id: userDB._id }, { otp: "", otpExpireAt: null })

        return res.json({ success: true, message: "OTP verifyed Successfully" })

    } catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }
}

const setnewPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!newPassword) {
            throw new Error("Please Enter password")
        }

        const hashPassword = await bcrypt.hash(newPassword, 10);

        const updatedUser = await user.findOneAndUpdate({ email }, { password: hashPassword })

        if (!updatedUser) {
            throw new Error("User not found.")
        }

        return res.json({ success: true, message: "Password Changes Successfully" })

    } catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }
}

//enable 2FA
const generateQRCode = async (req, res) => {
    try {
        const { name } = req.body;

        const secret = speakeasy.generateSecret();

        const url = speakeasy.otpauthURL({
            secret: secret.base32,
            label: `${name}`,
            issuer: "PassOP",
            encoding: "base32",
        })

        const qrImageUrl = await qrCode.toDataURL(url);

        const obj = {
            secret: secret.base32,
            qrCode: qrImageUrl
        }
        return res.json({ success: true, message: "OTP secret and QR code generated successfully.", obj });
    } catch (error) {
        return res.status(400).json({
            success: false, message: `Failed to generate OTP secret: ${error.message}`
        });
    }
}

const twoFA_varify = async (req, res) => {
    try {
        const userId = req.userId;
        const { otp, secret } = req.body;

        const verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: otp
        });

        if (!verified) {
            throw new Error("Invalid or expired OTP. Please try again.")
        }

        const encryptedSecret = CryptoJS.AES.encrypt(secret, process.env.CRYPTO_SECRET_KEY).toString();

        await user.findOneAndUpdate({ _id: userId }, { $set: { is2FA: true, twoFactorSecret: encryptedSecret } })

        return res.json({ success: true, message: "Two-Factor Authentication has been enabled successfully." });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message || "unexpected error occurred. Please try again later." });
    }
}


//disable 2FA
const disable2FA = async (req, res) => {
    try {
        const userId = req.userId;

        const { otp } = req.body;

        const secret = await user.findOne({ _id: userId }).select({ twoFactorSecret: 1 }).lean();

        const decryptSecret = CryptoJS.AES.decrypt(secret.twoFactorSecret, process.env.CRYPTO_SECRET_KEY).toString(CryptoJS.enc.Utf8);

        const verified = speakeasy.totp.verify({
            secret: decryptSecret,
            encoding: "base32",
            token: otp
        })

        if (!verified) {
            throw new Error("Invalid or expired OTP. Please try again.");
        }

        await user.findOneAndUpdate({ _id: userId }, { $set: { is2FA: false, twoFactorSecret: "" } });

        return res.json({ success: true, message: "Two-Factor Authentication has been disabled successfully." });

    } catch (error) {
        return res.status(400).json({ success: false, message: error.message || "An unexpected error occurred." })
    }
}


//handleLogin2FA
const twoFALogin = async (req, res) => {
    try {
        const { otp, userId } = req.body;

        if (!otp || !userId) {
            throw new Error("Required authentication details are missing.");
        }

        const userExists = await user.findOne({ _id: userId }).lean();

        if (!userExists) {
            throw new Error("We could not locate your account. Please check your details and try again.");
        }

        const decryptSecret = CryptoJS.AES.decrypt(userExists.twoFactorSecret, process.env.CRYPTO_SECRET_KEY).toString(CryptoJS.enc.Utf8);

        const verified = speakeasy.totp.verify({
            secret: decryptSecret,
            encoding: "base32",
            token: otp
        })

        if (!verified) {
            throw new Error("The verification code is invalid or has expired. Please try again.");
        }

        const token = generateToken(userExists._id);

        const cookiesOption = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? "none" : "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000
        }

        res.cookie("token", token, cookiesOption);

        let newAllPassword = [];

        if (userExists.AllPassword.length !== 0) {
            newAllPassword = userExists.AllPassword.map((currPass) => {
                if (currPass.Doctype === "card") {
                    let decryptCardNumber = CryptoJS.AES.decrypt(currPass.card_number, process.env.CRYPTO_SECRET_KEY).toString(CryptoJS.enc.Utf8);
                    let decryptCardHolderName = CryptoJS.AES.decrypt(currPass.card_holder_name, process.env.CRYPTO_SECRET_KEY).toString(CryptoJS.enc.Utf8)
                    return { ...currPass, card_number: decryptCardNumber, card_holder_name: decryptCardHolderName }
                } else {
                    const decryptPassword = CryptoJS.AES.decrypt(currPass.password, process.env.CRYPTO_SECRET_KEY).toString(CryptoJS.enc.Utf8)
                    return { ...currPass, password: decryptPassword }
                }
            })
        }

        const userDetails = {
            email: userExists.email,
            name: userExists.name,
            photoURL: userExists.photoURL,
            _id: userExists._id,
            collections: userExists.collections,
            AllPassword: newAllPassword,
            is2FA: userExists.is2FA,
            isPassKey: userExists.isPassKey,
            plan_type: userExists.plan_type,
            plan_expiry: userExists.plan_expiry
        }

        const sharedArr = await share.find({ $or: [{ from: userExists._id }, { to: userExists._id }] }).lean();

        //yeah recieved wala hai
        const recieved = userExists.recieved;

        const recievedResult = await recievedFunc(userExists, sharedArr);

        //yeah send wala hai
        const send = userExists.send;

        const sendResult = await sendFunc(userExists, sharedArr);

        return res.json({ success: true, message: "Your identity has been successfully verified.", user: userDetails, recieved, send, recievedResult, sendResult })

    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
}

//Reset Two-Factor Authentication - step-1 :- otpsend
const send2FAotp = async (req, res) => {
    try {
        const { userId, email } = req.body;

        if (!userId) {
            throw new Error("User ID is required.")
        }

        if (!email) {
            throw new Error("Email address is required.");
        }

        const randomNumber = Math.floor(100000 + Math.random() * 900000);

        await transporter.sendMail({
            from: '"PassOP" <bhupendra.223093108@vcet.edi.in>',
            to: email,
            subject: "🔐 PassOP 2FA Reset Code",
            html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset 2FA - PassOP</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f6f9fc;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 500px;
      margin: auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      background: #299f29;
      color: white;
      text-align: center;
      padding: 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }
    .content {
      padding: 20px;
      color: #333333;
      line-height: 1.6;
      font-size: 15px;
    }
    .otp-box {
      background: #f3f4f6;
      padding: 15px;
      text-align: center;
      font-size: 28px;
      letter-spacing: 5px;
      font-weight: bold;
      border-radius: 6px;
      margin: 20px 0;
      color: #222;
    }
    .footer {
      font-size: 12px;
      text-align: center;
      color: #888888;
      padding: 15px;
    }
  </style>
</head>
<body>
  <div className="container">
    <div className="header">
      <h1>PassOP 2FA Reset</h1>
    </div>
    <div className="content">
      <p>Hello,</p>
      <p>We received a request to reset your <b>Two-Factor Authentication (2FA)</b>. Use the code below to continue:</p>
      
      <div className="otp-box">${randomNumber}</div>

      <p>This code will expire in <b>5 minutes</b>. If you did not request this reset, we strongly recommend updating your account password and securing your account immediately.</p>
      
      <p>Thank you,<br/>The PassOP Security Team</p>
    </div>
    <div className="footer">
      &copy; ${new Date().getFullYear()} PassOP. All rights reserved.
    </div>
  </div>
</body>
</html>`,
        });

        await user.findByIdAndUpdate(userId, { $set: { otp: randomNumber, otpExpireAt: new Date(Date.now() + 1000 * 60 * 5) } })

        return res.json({ success: true, message: "Verification code sent to your email." })
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message || "Unable to process request." });
    }
}

//step-2 :- otp verify
const verify2FAotp = async (req, res) => {
    try {
        const { otp, email } = req.body;

        if (!otp) {
            throw new Error("OTP is Missing");
        }

        const userDB = await user.findOne({ email })

        if (!userDB) {
            throw new Error("User not found")
        }

        if (userDB.otp && userDB.otp !== otp) {
            throw new Error("Invalid otp.")
        }

        if (new Date() > userDB.otpExpireAt) {
            throw new Error("OTP is expired.")
        }

        const response = await user.findOneAndUpdate({ _id: userDB._id }, { otp: "", otpExpireAt: null }, { new: true }).lean();

        const secret = speakeasy.generateSecret();

        const url = speakeasy.otpauthURL({
            secret: secret.base32,
            label: `${response.name}`,
            issuer: "PassOP",
            encoding: "base32",
        })

        const qrImageUrl = await qrCode.toDataURL(url);

        const obj = {
            secret: secret.base32,
            qrCode: qrImageUrl
        }

        return res.json({ success: true, message: "OTP of reset 2FA is verified successfully", obj })
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }
}

//step-3 :- otp authenticator otp
const verifyAuthenticatorOTP = async (req, res) => {
    try {
        const { otp, secret, userId } = req.body;

        if (!otp || !secret || !userId) {
            throw new Error("Missing required information.");
        }

        const verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: otp
        });

        if (!verified) {
            throw new Error("Invalid or expired OTP. Please try again.")
        }

        const encryptedSecret = CryptoJS.AES.encrypt(secret, process.env.CRYPTO_SECRET_KEY).toString();

        await user.findOneAndUpdate({ _id: userId }, { $set: { twoFactorSecret: encryptedSecret } })

        return res.json({ success: true, message: "2FA reset successfully." });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message || "Something went wrong. Please try again." });
    }
}


//google login
const googleLogin = async (req, res) => {
    try {
        const client = new OAuth2Client(process.env.CLIENT_ID);

        const { token } = req.body;
        if (!token) {
            throw new Error("Token is missing");
        }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub, email, name, picture } = payload;

        if (!sub || !email || !name || !picture) {
            throw new Error("Some details are missing");
        }

        const userDB = await user.findOne({ email }).lean();

        if (!userDB) { //no user

            const randomPassword = crypto.randomBytes(10).toString("base64").slice(0, 10);
            const newUser = new user({ _id: uuid().toString(), name, email, password: randomPassword, photoURL: picture, provider: "google" })

            const userExists = await newUser.save(); //user register

            const token = generateToken(userExists._id);

            const cookiesOption = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? "none" : "lax",
                maxAge: 30 * 24 * 60 * 60 * 1000
            }

            res.cookie("token", token, cookiesOption);

            let newAllPassword = [];

            if (userExists.AllPassword.length !== 0) {
                newAllPassword = userExists.AllPassword.map((currPass) => {
                    if (currPass.Doctype === "card") {
                        let decryptCardNumber = CryptoJS.AES.decrypt(currPass.card_number, process.env.CRYPTO_SECRET_KEY).toString(CryptoJS.enc.Utf8);
                        let decryptCardHolderName = CryptoJS.AES.decrypt(currPass.card_holder_name, process.env.CRYPTO_SECRET_KEY).toString(CryptoJS.enc.Utf8)
                        return { ...currPass, card_number: decryptCardNumber, card_holder_name: decryptCardHolderName }
                    } else {
                        const decryptPassword = CryptoJS.AES.decrypt(currPass.password, process.env.CRYPTO_SECRET_KEY).toString(CryptoJS.enc.Utf8)
                        return { ...currPass, password: decryptPassword }
                    }
                })
            }

            const userDetails = {
                email: userExists.email,
                name: userExists.name,
                photoURL: userExists.photoURL,
                _id: userExists._id,
                collections: userExists.collections,
                AllPassword: newAllPassword,
                is2FA: userExists.is2FA
            }

            const sharedArr = await share.find({ $or: [{ from: userExists._id }, { to: userExists._id }] }).lean();

            //yeah recieved wala hai
            const recieved = userExists.recieved;

            const recievedResult = await recievedFunc(userExists, sharedArr);

            //yeah send wala hai
            const send = userExists.send;

            const sendResult = await sendFunc(userExists, sharedArr);


            return res.json({ success: true, message: "User logged in successfully.", user: userDetails, recieved, send, recievedResult, sendResult }) //user logged in
        }

        //user exists
        if (userDB.provider !== "google") {
            throw new Error("Sign in with your password to access this account.")
        }

        if (!userDB.is2FA) { //is2FA = false
            const userExists = userDB;

            const token = generateToken(userExists._id);

            const cookiesOption = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? "none" : "lax",
                maxAge: 30 * 24 * 60 * 60 * 1000
            }

            res.cookie("token", token, cookiesOption);

            let newAllPassword = [];

            if (userExists.AllPassword.length !== 0) {
                newAllPassword = userExists.AllPassword.map((currPass) => {
                    if (currPass.Doctype === "card") {
                        let decryptCardNumber = CryptoJS.AES.decrypt(currPass.card_number, process.env.CRYPTO_SECRET_KEY).toString(CryptoJS.enc.Utf8);
                        let decryptCardHolderName = CryptoJS.AES.decrypt(currPass.card_holder_name, process.env.CRYPTO_SECRET_KEY).toString(CryptoJS.enc.Utf8)
                        return { ...currPass, card_number: decryptCardNumber, card_holder_name: decryptCardHolderName }
                    } else {
                        const decryptPassword = CryptoJS.AES.decrypt(currPass.password, process.env.CRYPTO_SECRET_KEY).toString(CryptoJS.enc.Utf8)
                        return { ...currPass, password: decryptPassword }
                    }
                })
            }

            const userDetails = {
                email: userExists.email,
                name: userExists.name,
                photoURL: userExists.photoURL,
                _id: userExists._id,
                collections: userExists.collections,
                AllPassword: newAllPassword,
                is2FA: userExists.is2FA,
                isPassKey: userExists.isPassKey,
                plan_type: userExists.plan_type,
                plan_expiry: userExists.plan_expiry
            }

            const sharedArr = await share.find({ $or: [{ from: userExists._id }, { to: userExists._id }] }).lean();

            //yeah recieved wala hai
            const recieved = userExists.recieved;

            const recievedResult = await recievedFunc(userExists, sharedArr);

            //yeah send wala hai
            const send = userExists.send;

            const sendResult = await sendFunc(userExists, sharedArr);


            return res.json({ success: true, message: "User logged in successfully.", user: userDetails, recieved, send, recievedResult, sendResult })
        }

        const userDetails = {
            _id: userDB._id,
            email: userDB.email,
            name: userDB.name,
            photoURL: userDB.photoURL,
            is2FA: userDB.is2FA,
            isPassKey: userDB.isPassKey,
            plan_type: userDB.plan_type,
            plan_expiry: userDB.plan_expiry
        }

        return res.json({ success: true, message: "User logged in successfully.", user: userDetails })

    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
}


//delete user ko vrify agar 2FA on hai
const delete2FAVerify = async (req, res) => {
    try {
        const userId = req.userId;
        const { otp } = req.body;

        if (!otp) {
            throw new Error("OTP is missing");
        }

        const userDB = await user.findById(userId).lean();

        const decryptSecret = CryptoJS.AES.decrypt(userDB.twoFactorSecret, process.env.CRYPTO_SECRET_KEY).toString(CryptoJS.enc.Utf8);

        const verified = speakeasy.totp.verify({
            secret: decryptSecret,
            encoding: "base32",
            token: otp,
        })

        if (!verified) {
            throw new Error("Invalid or expired OTP. Please try again.")
        }

        return res.json({ success: true, message: "2FA verified successfully." });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
}

//Adding passkey Router
const rpName = process.env.RP_NAME;
const rpID = process.env.RP_ID;
const origin = process.env.ORIGIN;

//regeter passkey
//1.creating option
const createRegistrationOption = async (req, res) => {
    try {
        const userId = req.userId;

        let userDB = await user.findById(userId).lean();

        const option = await generateRegistrationOptions({
            rpName,
            rpID,
            userName: userDB.name,
            userDisplayName: userDB.name,
            timeout: 1000 * 60,
        })

        await regesterChallenge.findOneAndUpdate({ userId: userDB._id }, { $set: { challenge: option.challenge } }, { upsert: true });

        return res.json({ success: true, message: "Option is created", option });
    } catch (error) {
        return res.status(400).json({ success: false, message: "Cannot create option" });
    }
}

//2.verifying option
const verifyRegisterChallenge = async (req, res) => {
    try {
        const { browserRes } = req.body;
        const userId = req.userId;

        if (!browserRes) {
            throw new Error("Details are missing");
        }

        const userwithchallenge = await regesterChallenge.findOne({ userId }).lean();

        if (!userwithchallenge) {
            throw new Error("USer not verified");
        }

        const verification = await verifyRegistrationResponse({
            response: browserRes,
            expectedChallenge: userwithchallenge.challenge,
            expectedOrigin: origin,
            expectedRPID: rpID,
        })

        if (!verification.verified) {
            throw new Error("PassKey registration failed")
        }

        const passKey = {
            id: verification.registrationInfo.credential.id,
            publicKey: Buffer.from(verification.registrationInfo.credential.publicKey).toString("base64url"),
            counter: verification.registrationInfo.credential.counter,
            transports: verification.registrationInfo.credential.transports
        }

        await user.findByIdAndUpdate(userId, { $set: { isPassKey: true, passKey } });

        await regesterChallenge.deleteOne({ userId });

        return res.json({ success: true, message: "Challege verified successfully" });
    } catch (error) {
        return res.status(400).json({ success: false, message: "Challege failed" });
    }
}


//login passkey
//1.creating option
const createLoginOption = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            throw new Error("userId not found")
        }

        let userDB = await user.findById(userId).lean();

        if (!userDB) {
            throw new Error("User not found");
        }

        if (!userDB.isPassKey) {
            throw new Error("Not regestered Biomatric login")
        }

        const option = await generateAuthenticationOptions({
            rpID,
            allowCredentials: [
                {
                    id: userDB.passKey.id,
                    type: "public-key",
                    transports: userDB.passKey.transports || ["usb", "ble", "nfc", "internal"]
                }
            ],
            timeout: 1000 * 60,
        })

        await loginChallenge.findOneAndUpdate({ userId: userDB._id }, { $set: { challenge: option.challenge } }, { upsert: true });

        return res.json({ success: true, message: "Option is created", option });
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ success: false, message: "Cannot create option" });
    }
}

//2.verifying option
const verifyLoginChallenge = async (req, res) => {
    try {
        const { browserRes, userId } = req.body;

        if (!browserRes || !userId) {
            throw new Error("Details are missing");
        }

        const userDB = await user.findById(userId).lean();

        if (!userDB) {
            throw new Error("User not found");
        }

        if (!userDB.isPassKey) {
            throw new Error("User not regetered passKey");
        }

        const userwithchallenge = await loginChallenge.findOne({ userId }).lean();

        if (!userwithchallenge) {
            throw new Error("User not verified");
        }

        const verification = await verifyAuthenticationResponse({
            response: browserRes,
            expectedChallenge: userwithchallenge.challenge,
            expectedOrigin: origin,
            expectedRPID: rpID,
            credential: {
                id: Buffer.from(userDB.passKey.id, "base64url"),
                publicKey: Buffer.from(userDB.passKey.publicKey, "base64url"),
                counter: userDB.passKey.counter,
                transports: userDB.passKey.transports || ["usb", "ble", "nfc", "internal"],
            }
        })

        if (!verification.verified) {
            throw new Error("Login failed")
        }

        await loginChallenge.deleteOne({ userId });

        if (!userDB.is2FA) { //is2FA = false
            const token = generateToken(userDB._id);

            const cookiesOption = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? "none" : "lax",
                maxAge: 30 * 24 * 60 * 60 * 1000
            }

            res.cookie("token", token, cookiesOption);

            let newAllPassword = [];

            if (userDB.AllPassword.length !== 0) {
                newAllPassword = userDB.AllPassword.map((currPass) => {
                    if (currPass.Doctype === "card") {
                        let decryptCardNumber = CryptoJS.AES.decrypt(currPass.card_number, process.env.CRYPTO_SECRET_KEY).toString(CryptoJS.enc.Utf8);
                        let decryptCardHolderName = CryptoJS.AES.decrypt(currPass.card_holder_name, process.env.CRYPTO_SECRET_KEY).toString(CryptoJS.enc.Utf8)
                        return { ...currPass, card_number: decryptCardNumber, card_holder_name: decryptCardHolderName }
                    } else {
                        const decryptPassword = CryptoJS.AES.decrypt(currPass.password, process.env.CRYPTO_SECRET_KEY).toString(CryptoJS.enc.Utf8)
                        return { ...currPass, password: decryptPassword }
                    }
                })
            }

            const userDetails = {
                email: userDB.email,
                name: userDB.name,
                photoURL: userDB.photoURL,
                _id: userDB._id,
                collections: userDB.collections,
                AllPassword: newAllPassword,
                is2FA: userDB.is2FA,
                isPassKey: userDB.isPassKey,
                plan_type: userDB.plan_type,
                plan_expiry: userDB.plan_expiry
            }

            const sharedArr = await share.find({ $or: [{ from: userDB._id }, { to: userDB._id }] }).lean();

            //yeah recieved wala hai
            const recieved = userDB.recieved;

            const recievedResult = await recievedFunc(userDB, sharedArr);

            //yeah send wala hai
            const send = userDB.send;

            const sendResult = await sendFunc(userDB, sharedArr);


            return res.json({ success: true, message: "User logged in successfully.", user: userDetails, recieved, send, recievedResult, sendResult })
        }

        const userDetails = {
            _id: userDB._id,
            email: userDB.email,
            name: userDB.name,
            photoURL: userDB.photoURL,
            is2FA: userDB.is2FA,
            isPassKey: userDB.isPassKey,
            plan_type: userDB.plan_type,
            plan_expiry: userDB.plan_expiry
        }

        return res.json({ success: true, message: "User logged in successfully.", user: userDetails })
    } catch (error) {
        console.log(error.stack);
        return res.status(400).json({ success: false, message: "Challege failed" });
    }
}

//delete passkey
const deletePasskey = async (req, res) => {
    try {
        const userId = req.userId;

        await user.findByIdAndUpdate(userId, { $set: { isPassKey: false, passKey: {} } });

        return res.json({ success: true, message: "PassKey deleted successfully" })
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
}


export { register, userlogin, isLoggedIn, delUser, Logout, sendOpt, verifyOtp, setnewPassword, generateQRCode, twoFA_varify, disable2FA, twoFALogin, send2FAotp, verify2FAotp, verifyAuthenticatorOTP, googleLogin, delete2FAVerify, createRegistrationOption, verifyRegisterChallenge, createLoginOption, verifyLoginChallenge, deletePasskey }