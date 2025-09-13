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

        await userDB.save()

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
            AllPassword: newAllPassword
        }

        const sharedArr = await share.find({ $or: [{ from: userExists._id }, { to: userExists._id }] }).lean();

        //yeah recieved wala hai
        const recieved = userExists.recieved;

        const recievedResult = await recievedFunc(userExists, sharedArr);

        //yeah send wala hai
        const send = userExists.send;

        const sendResult = await sendFunc(userExists, sharedArr);

        return res.json({ success: true, message: "User logged in successfully.", user: userDetails, recieved, send, recievedResult, sendResult })

    } catch (error) {
        console.log(error.stack);
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
        // console.log(error.stack);
        return res.status(400).json({ success: false, message: error.message });
    }
}

const Logout = async (req, res) => {
    try {
        const cookiesOption = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
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
        const { email, password } = req.body;

        const userDB = await user.findOne({ email });

        if (!userDB) {
            throw new Error("User not found.");
        }

        const checkPassword = await bcrypt.compare(password, userDB.password)

        if (!checkPassword) {
            throw new Error("Invalid credentials.");
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
        return res.json({ success: true, message: "User deleted successfully.", Ids : [...Ids] })
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


export { register, userlogin, isLoggedIn, delUser, Logout, sendOpt, verifyOtp, setnewPassword }