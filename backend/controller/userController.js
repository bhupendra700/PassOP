import user from "../models/userModel.js";
import transporter from "../config/nodemailer.js";
import { v4 as uuid } from "uuid";
import CryptoJS from "crypto-js";
import axios from "axios";
import share from "../models/shareModel.js";
import mongoose from "mongoose";

function getHostName(url) {
    try {
        return new URL(url).origin; // sirf protocol + hostname
    } catch (e) {
        return null; // agar galat URL hai
    }
}

//password part
const addPass = async (req, res) => {
    try {
        const userId = req.userId;
        const { url, username, password, notes, Doctype } = req.body.docs;
        const { cat } = req.body;

        const encryptPassword = CryptoJS.AES.encrypt(password, process.env.CRYPTO_SECRET_KEY).toString();

        const newPassword = {
            _id: uuid(),
            Doctype,
            url,
            username,
            password: encryptPassword,
            notes,
        }

        if (cat === "All") {
            await user.updateOne({ _id: userId }, { $push: { AllPassword: newPassword } })
        } else {
            await user.updateOne(
                { _id: userId, "collections.name": cat },
                { $push: { AllPassword: newPassword, "collections.$.passwordID": newPassword._id } }
            );
        }

        return res.json({ success: true, message: "Password has been added successfully.", data: { ...newPassword, password } })
    } catch (error) {
        return res.status(400).json({ success: false, type: "normal", message: error.message })
    }
}

const addEmail = async (req, res) => {
    try {
        const userId = req.userId;
        const { email, password, notes, Doctype } = req.body.docs;
        const { cat } = req.body;

        const encryptPassword = CryptoJS.AES.encrypt(password, process.env.CRYPTO_SECRET_KEY).toString();

        const newEmail = {
            _id: uuid(),
            Doctype,
            email,
            password: encryptPassword,
            notes,
        }

        if (cat === "All") {
            await user.updateOne({ _id: userId }, { $push: { AllPassword: newEmail } })
        } else {
            await user.updateOne(
                { _id: userId, "collections.name": cat },
                { $push: { AllPassword: newEmail, "collections.$.passwordID": newEmail._id } }
            );
        }

        return res.json({ success: true, message: "Password has been added successfully.", data: { ...newEmail, password } })
    } catch (error) {
        return res.status(400).json({ success: false, type: "normal", message: error.message })
    }
}

const editPass = async (req, res) => {
    try {
        const userId = req.userId;

        const { _id } = req.body.docs;

        const encryptPassword = CryptoJS.AES.encrypt(req.body.docs.password, process.env.CRYPTO_SECRET_KEY).toString();

        const newDocs = { ...req.body.docs, password: encryptPassword }

        await user.updateOne({ _id: userId, "AllPassword._id": _id }, { $set: { "AllPassword.$": newDocs } })

        return res.json({ success: true, message: "Password updated successfully." })

    } catch (error) {
        return res.status(400).json({ success: false, type: "normal", message: error.message })
    }
}

const addCard = async (req, res) => {
    try {
        const userId = req.userId;

        const { docs, cat } = req.body;
        const { card_holder_name, card_number, expiry_date } = docs;

        const clean_expiry_date = expiry_date.split("/").map((ele) => ele.trim()).join("/")

        const validCardNumber = card_number.replace(/\s+/g, "")
        let cardDetails = ""

        try {
            cardDetails = await axios.get(`https://lookup.binlist.net/${validCardNumber.slice(0, 8)}`)
        } catch (error) {
            throw new Error("Could't fetch card detail. Something went wrong. Please try again later")
        }

        if (!cardDetails?.data?.scheme) {
            throw new Error("Invalid card number. Please try again with a valid one.")
        }

        let custome_search = "";

        if (cardDetails?.data?.scheme) {
            custome_search = await axios.get("https://www.googleapis.com/customsearch/v1", {
                params: {
                    key: process.env.GOOGLE_SEARCH_API_KEY,
                    cx: process.env.GOOGLE_SEARCH_CX,
                    q: `${cardDetails.data.scheme} credit card`
                }
            })
        }

        let bankUrlSearch = "";
        if (cardDetails?.data?.bank.name) {
            bankUrlSearch = await axios.get("https://www.googleapis.com/customsearch/v1", {
                params: {
                    key: process.env.GOOGLE_SEARCH_API_KEY,
                    cx: process.env.GOOGLE_SEARCH_CX,
                    q: `${cardDetails.data.bank.name} bank`
                }
            })
        }

        const brandUrl = getHostName(custome_search?.data?.items[0]?.link) || ""
        const brandName = cardDetails.data.scheme || "";
        const card_type = cardDetails.data.type || "";
        const bankUrl = getHostName(bankUrlSearch?.data?.items[0]?.link) || "";
        const bankName = cardDetails.data.bank.name || "";
        const encryptCardHolderName = CryptoJS.AES.encrypt(card_holder_name, process.env.CRYPTO_SECRET_KEY).toString()

        const encryptCardNumber = CryptoJS.AES.encrypt(validCardNumber, process.env.CRYPTO_SECRET_KEY).toString();

        const cardDB = {
            _id: uuid(),
            Doctype: "card",
            card_holder_name: encryptCardHolderName,
            card_number: encryptCardNumber,
            expiry_date: clean_expiry_date,
            brandUrl,
            brandName,
            card_type,
            bankUrl,
            bankName,
        }

        if (cat === "All") {
            await user.updateOne({ _id: userId }, { $push: { AllPassword: cardDB } })
        } else {
            await user.updateOne(
                { _id: userId, "collections.name": cat },
                { $push: { AllPassword: cardDB, "collections.$.passwordID": cardDB._id } }
            );
        }

        return res.json({ success: true, message: "Card Added Successfully.", data: { ...cardDB, card_holder_name, card_number: validCardNumber } })
    } catch (error) {
        return res.status(400).json({ success: false, type: "normal", message: error.message })
    }
}

const editCard = async (req, res) => {
    try {
        const userId = req.userId;

        const { _id, card_holder_name, card_number, expiry_date } = req.body.docs;

        const clean_expiry_date = expiry_date.split("/").map((ele) => ele.trim()).join("/")

        const validCardNumber = card_number.replace(/\s+/g, "")
        let cardDetails = ""

        try {
            cardDetails = await axios.get(`https://lookup.binlist.net/${validCardNumber.slice(0, 8)}`)
        } catch (error) {
            throw new Error("Could't fetch card detail. Something went wrong. Please try again later")
        }

        if (!cardDetails?.data?.scheme) {
            throw new Error("Invalid card number. Please try again with a valid one.")
        }

        let custome_search = "";

        if (cardDetails?.data?.scheme) {
            custome_search = await axios.get("https://www.googleapis.com/customsearch/v1", {
                params: {
                    key: process.env.GOOGLE_SEARCH_API_KEY,
                    cx: process.env.GOOGLE_SEARCH_CX,
                    q: `${cardDetails.data.scheme} credit card`
                }
            })
        }

        let bankUrlSearch = "";
        if (cardDetails?.data?.bank.name) {
            bankUrlSearch = await axios.get("https://www.googleapis.com/customsearch/v1", {
                params: {
                    key: process.env.GOOGLE_SEARCH_API_KEY,
                    cx: process.env.GOOGLE_SEARCH_CX,
                    q: `${cardDetails.data.bank.name} bank`
                }
            })
        }

        const brandUrl = getHostName(custome_search?.data?.items[0]?.link) || ""
        const brandName = cardDetails.data.scheme || "";
        const card_type = cardDetails.data.type || "";
        const bankUrl = getHostName(bankUrlSearch?.data?.items[0]?.link) || "";
        const bankName = cardDetails.data.bank.name || "";
        const encryptCardHolderName = CryptoJS.AES.encrypt(card_holder_name, process.env.CRYPTO_SECRET_KEY).toString()

        const encryptCardNumber = CryptoJS.AES.encrypt(validCardNumber, process.env.CRYPTO_SECRET_KEY).toString();

        const cardDB = {
            _id,
            Doctype: "card",
            card_holder_name: encryptCardHolderName,
            card_number: encryptCardNumber,
            expiry_date: clean_expiry_date,
            brandUrl,
            brandName,
            card_type,
            bankUrl,
            bankName
        }

        await user.updateOne({ _id: userId, "AllPassword._id": _id }, { $set: { "AllPassword.$": cardDB } })

        return res.json({ success: true, message: "Card Added Successfully.", data: { ...cardDB, card_holder_name, card_number: validCardNumber } })
    } catch (error) {
        return res.status(400).json({ success: false, type: "normal", message: error.message })
    }
}

const deletePass = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { _id, deleteObj, sentDocs } = req.body;

        if (!_id || !_id.trim()) {
            throw new Error("Password ID is required.");
        }

        const userId = req.userId;

        const resDB = await user.findOneAndUpdate({ _id: userId }, {
            $pull: {
                AllPassword: { _id },
                "collections.$[].passwordID": _id
            }
        }, { new: true, projection: { collections: 1, _id: 0 }, session })

        const shareIdArr = sentDocs.filter((ele) => ele._id === deleteObj._id).map((ele) => ele.shareId);

        await share.deleteMany({ _id: { $in: shareIdArr } }, { session });

        await session.commitTransaction()
        session.endSession()

        return res.json({ success: true, message: "Password deleted successfully.", collections: resDB.collections })
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ success: false, type: "normal", message: error.message })
    }
}

//collection part
const addCollection = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            throw new Error("Please provide a collection name.");
        }

        if (name.length < 2) {
            throw new Error("Collection name must be 2 character long");
        }

        const collection = { _id: uuid(), name, passwordID: [] };

        await user.updateOne(
            { _id: req.userId },
            { $push: { collections: collection } },
        );

        return res.status(201).json({
            success: true,
            message: "The collection has been added successfully.",
            data: collection
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "An error occurred while adding the collection."
        });
    }
};

const renameCollection = async (req, res) => {
    try {
        const { colid, name } = req.body;
        const userId = req.userId;

        if (!colid || !colid.trim()) {
            throw new Error("Collection ID is required.");
        }

        if (!name || !name.trim()) {
            throw new Error("The new collection name is required.");
        }

        if (name.length < 2) {
            throw new Error("Collection name must be 2 character long");
        }

        await user.updateOne(
            { _id: userId, "collections._id": colid },
            { $set: { "collections.$.name": name } }
        );

        return res.json({
            success: true,
            message: "The collection name has been updated successfully."
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "An unexpected error occurred."
        });
    }
};

const deleteCollection = async (req, res) => {
    try {
        const userId = req.userId;
        const { colid } = req.body

        if (!colid) {
            throw new Error("Please provide a valid collection ID.")
        }

        await user.updateOne({ _id: userId }, { $pull: { collections: { _id: colid } } });

        return res.json({ success: true, message: "The collection has been deleted successfully." })

    } catch (error) {
        return res.status(400).json({ success: false, message: error.message || "An unexpected error occurred while deleting the collection." });
    }
}

const addPasswordInCollection = async (req, res) => {
    try {
        const { colid, passwordIds } = req.body;
        const userId = req.userId;

        if (!colid || passwordIds.length == 0) {
            throw new Error("Both collection ID and password ID are required.");
        }

        await user.updateOne(
            { _id: userId, "collections._id": colid },
            { $push: { "collections.$.passwordID": { $each: passwordIds } } }
        );

        return res.json({
            success: true,
            message: "Password added successfully to the collection."
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "An unexpected error occurred."
        });
    }
};

const deletePasswordFromCollection = async (req, res) => {
    try {

        const userId = req.userId;
        const { colid, passwordId } = req.body;

        if (!colid || !colid.trim()) {
            throw new Error("Collection ID is required.")
        }

        if (!passwordId || !passwordId.trim()) {
            throw new Error("PasswordId is required.")
        }

        await user.updateOne({ _id: userId, "collections._id": colid },
            { $pull: { "collections.$.passwordID": passwordId } })

        return res.json({ success: true, mesaage: "Password deleted successfully from the collection" })
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message || "UnAccpected error is occured" })
    }
}

//send contactus email
const contactUs = async (req, res) => {
    try {
        const { name, email, message } = req.body

        await transporter.sendMail({
            from: `PassOP Team <passop7021@gmail.com>`,
            to: "passop7021@gmail.com",
            replyTo: email,
            subject: `PassOP Contact Request from ${name}`,
            html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>New Contact Us Message</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: "Segoe UI", Arial, sans-serif;
      background-color: #f0f7f0;
    }
    .container {
      background: #fff;
      max-width: 650px;
      margin: 30px auto;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 6px 20px rgba(0,0,0,0.1);
      border: 1px solid #e0e0e0;
    }
    .header {
      background: #299f29;
      color: #fff;
      text-align: center;
      padding: 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 22px;
      letter-spacing: 1px;
    }
    .content {
      padding: 25px 30px;
      color: #333;
    }
    .content p {
      margin: 12px 0;
      font-size: 15px;
      line-height: 1.6;
    }
    .highlight {
      font-weight: bold;
      color: #299f29;
    }
    .message-box {
      background: #f9fdf9;
      border-left: 4px solid #299f29;
      padding: 15px;
      margin-top: 15px;
      border-radius: 6px;
      font-style: italic;
    }
    .footer {
      background: #f4f4f4;
      text-align: center;
      padding: 15px;
      font-size: 13px;
      color: #666;
    }
    .footer a {
      color: #299f29;
      text-decoration: none;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📩 New Contact Request - PassOP</h1>
    </div>
    <div class="content">
      <p><span class="highlight">Name:</span> ${name}</p>
      <p><span class="highlight">Email:</span> ${email}</p>
      <p><span class="highlight">Message:</span></p>
      <div class="message-box">
        ${message}
      </div>
    </div>
    <div class="footer">
      This email was sent from the <strong>PassOP Contact Form</strong>. <br>
      <a href="https://passop.example.com">Visit Website</a>
    </div>
  </div>
</body>
</html>
`
        });

        return res.status(200).send({ success: true, message: "Your message has been delivered! Our team will review your request and contact you shortly." })

    } catch (error) {
        return res.status(400).json({ success: false, type: "server", message: error.message })
    }
}


export { addPass, addEmail, editPass, addCard, editCard, deletePass, addCollection, renameCollection, deleteCollection, addPasswordInCollection, deletePasswordFromCollection, contactUs }