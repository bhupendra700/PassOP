import mongoose from "mongoose";
import user from "../models/userModel.js";
import share from "../models/shareModel.js";
import { v4 as uuid } from 'uuid';
import tokenCollection from '../models/tokensCollections.js'
import admin from '../config/firebaseadmin.cjs'

const searchUser = async (req, res) => {
    try {
        const email = req.body.email;

        if (!email) {
            throw new Error("Please Enter Email");
        }

        if (!(email.length >= 15) || !email.endsWith("@gmail.com")) {
            throw new Error("Please Enter Valid Email")
        }

        const findUser = await user.findOne({ email }).select({ _id: 1, name: 1, email: 1, photoURL: 1 });

        if (!findUser) {
            throw new Error("User not found");
        }

        return res.json({ success: true, message: "User Found SuccessFully", userDB: findUser })

    } catch (error) {
        return res.status(400).json({ success: false, type: "normal", message: error.message })
    }
}

const sendRequest = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const { _id: senderId, name: senderName, email: senderEmail, photoURL: senderPhoto } = req.body.sender;

        const { _id: receiverId, name: receiverName, email: receiverEmail, photoURL: receiverPhoto } = req.body.reciever;

        //for reciever side
        if (!receiverId) {
            throw new Error("User Not Found")
        }

        if (!senderId || !senderName || !senderEmail || !senderPhoto) {
            throw new Error("Your details are missing")
        }

        const userRequest = {
            _id: uuid(), userId: senderId, name: senderName, email: senderEmail, photoURL: senderPhoto, status: "pending",
        }

        await user.updateOne({ _id: receiverId }, { $push: { "recieved": userRequest } }, { session }) //another user ke recieved mai save 

        if (!receiverName || !receiverEmail || !receiverPhoto) {
            throw new Error("Some details are missing")
        }

        const ownRequest = { _id: uuid(), userId: receiverId, name: receiverName, email: receiverEmail, photoURL: receiverPhoto, status: "pending", }

        await user.updateOne({ _id: senderId }, { $push: { "send": ownRequest } }, { session }) //another user ke recieved mai save 

        await session.commitTransaction()
        session.endSession()

        return res.json({ success: true, message: "Request sent successfully", request: ownRequest, userRequest });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ success: false, message: error.message })
    }
}

const acceptRequest = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        //sender matlab jo request ko accept kar raha hai
        const { _id: senderId, name: senderName, email: senderEmail, photoURL: senderPhoto } = req.body.sender;

        //reciever matlab jiska request accept kar raha hai
        const { _id: receiverId, name: receiverName, email: receiverEmail, photoURL: receiverPhoto } = req.body.reciever;

        //current user ke DB ke reciever field mai update
        const recieverDB = await user.findOne({ _id: senderId, "recieved.email": receiverEmail }).select({ "recieved.$": 1 }).lean();

        await user.updateOne({ _id: senderId, "recieved.email": receiverEmail }, { $pull: { recieved: { email: receiverEmail } } }, { session })

        await user.updateOne({ _id: senderId }, { $push: { recieved: { ...recieverDB.recieved[0], status: "accepted" } } }, { session });

        //request jisne sent kiya uske DB ke send field mai update
        const senderDB = await user.findOne({ _id: receiverId, "send.email": senderEmail }).select({ "send.$": 1 }).lean();

        await user.updateOne({ _id: receiverId, "send.email": senderEmail }, { $pull: { send: { email: senderEmail } } }, { session })

        await user.updateOne({ _id: receiverId }, { $push: { send: { ...senderDB.send[0], status: "accepted" } } }, { session });

        await session.commitTransaction()
        session.endSession()
        return res.json({ success: true, message: "request Accepted Successfully" });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ success: false, message: error.message });
    }
}

const sendRequestCancel = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        console.log("sender: ", req.body.sender);
        console.log("reciever: ", req.body.reciever);
        //sender ka matlab jisne request sent kiya tha aur wo ab cancel karna cahta hai
        const { _id: senderId, name: senderName, email: senderEmail, photoURL: senderPhoto } = req.body.sender;

        //reciever matlab jispe request gya hai
        const { _id: receiverId, name: receiverName, email: receiverEmail, photoURL: receiverPhoto } = req.body.reciever;

        await user.updateOne({ _id: senderId }, { $pull: { send: { email: receiverEmail } } }, { session });

        await user.updateOne({ _id: receiverId }, { $pull: { recieved: { email: senderEmail } } }, { session });

        await session.commitTransaction();
        session.endSession()
        return res.json({ success: true, message: "Request Cancel Successfully" })
    } catch (error) {
        await session.abortTransaction();
        session.endSession()
        return res.status(400).json({ success: false, message: error.message })
    }
}

const recievedRequestCancel = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        //sender ka matlab jisne request sent kiya tha
        const { _id: senderId, name: senderName, email: senderEmail, photoURL: senderPhoto } = req.body.sender;

        //reciever ka matlab jispe request gya tha aur ab wo cancel kar raha hai
        const { _id: receiverId, name: receiverName, email: receiverEmail, photoURL: receiverPhoto } = req.body.reciever;

        await user.updateOne({ _id: receiverId }, { $pull: { recieved: { email: senderEmail } } }, { session });

        await user.updateOne({ _id: senderId }, { $pull: { send: { email: receiverEmail } } }, { session });

        await session.commitTransaction();
        session.endSession()
        return res.json({ success: true, message: "Request Cancel Successfully" })
    } catch (error) {
        await session.abortTransaction();
        session.endSession()
        return res.status(400).json({ success: false, message: error.message })
    }
}

const deleteUserfromrequestsent = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        //sender ka matlab jisne request sent kiya tha aur ab wo delete kar raha hau accepted user ko
        const { _id: senderId, name: senderName, email: senderEmail, photoURL: senderPhoto } = req.body.sender;

        //reciever ka matlab jispe request gya tha aur usne accept kar liya tha
        const { _id: receiverId, name: receiverName, email: receiverEmail, photoURL: receiverPhoto } = req.body.reciever;

        await user.updateOne({ _id: senderId }, { $pull: { send: { email: receiverEmail } } }, { session })

        await user.updateOne({ _id: receiverId }, { $pull: { recieved: { email: senderEmail } } }, { session })

        //sender ka sab send kiya hua docs delete karana hai share Collection mai se
        await share.deleteMany({ from: senderId, to: receiverId }, { session });

        await session.commitTransaction()
        session.endSession()
        return res.json({ success: true, message: "Request deleted successfully" })

    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        return res.status(400).json({ success: false, message: error.message })
    }
}

const deleteUserfromrequestrecieved = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        //sender ka matlab jisne request sent kiya tha aur usse delete kar raha hai reciever
        const { _id: senderId, name: senderName, email: senderEmail, photoURL: senderPhoto } = req.body.sender;

        //reciever ka matlab jispe request gya tha aur usne accept kar liya tha aur ab wo uss user ko delete kar raha hai
        const { _id: receiverId, name: receiverName, email: receiverEmail, photoURL: receiverPhoto } = req.body.reciever;

        await user.updateOne({ _id: receiverId }, { $pull: { recieved: { email: senderEmail } } }, { session })

        await user.updateOne({ _id: senderId }, { $pull: { send: { email: receiverEmail } } }, { session })

        //sender ka sab send kiya hua docs delete karana hai share Collection mai se
        await share.deleteMany({ from: senderId, to: receiverId }, { session });

        await session.commitTransaction()
        session.endSession()
        return res.json({ success: true, message: "Request deleted successfully" })
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        return res.status(400).json({ success: false, message: error.message })
    }
}

const deleteSendedDocs = async (req, res) => {
    try {
        const { _id } = req.body;
        await share.deleteOne({ _id });
        return res.json({ success: true, message: "Docs Deleted Successfully" })
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }
}

const deleteRecievedDocs = async (req, res) => {
    try {
        const { _id } = req.body;
        await share.deleteOne({ _id });
        return res.json({ success: true, message: "Docs Deleted Successfully" })
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }
}

const sendDocs = async (req, res) => {
    try {
        const { arr_of_Id, _id: passwordId, expiredAt } = req.body;
        const from = req.userId;

        if (arr_of_Id.length == 0) {
            return res.json({ success: true, message: "Docs sended Successfully" })
        }

        const docsArr = [];

        const exists = await share.find({ from, to: { $in: arr_of_Id }, passwordId }).lean();

        const to = exists.map((ele) => ele.to) //yeah to sirf update karna hai

        const ids = exists.map((ele) => ele._id) //shareId jismai update karna hai

        for (let i = 0; i < arr_of_Id.length; i++) { //wo jo shareDocs collecftion mai insert karna hai
            if (!to.includes(arr_of_Id[i])) {
                const docs = { from, to: arr_of_Id[i], passwordId };
                if (expiredAt !== "Never") {
                    docs.expiredAt = new Date(Date.now() + (parseInt(expiredAt) * 24 * 60 * 60 * 1000));
                }
                docsArr.push(docs);
            }
        }

        let resId = [];

        if (ids.length > 0) {
            if (expiredAt == "Never") {
                await share.updateMany({ _id: { $in: ids } },
                    {
                        $set: { createdAt: new Date() },
                        $unset: { expiredAt: 1 }
                    })
            } else {
                await share.updateMany({ _id: { $in: ids } }, { $set: { createdAt: new Date(), expiredAt: new Date(Date.now() + (parseInt(expiredAt) * 24 * 60 * 60 * 1000)) } })
            }

            to.forEach(to => {
                resId.push([to, null]);
            })
        }

        if (docsArr.length > 0) {
            const dbres = await share.insertMany(docsArr);
            dbres.forEach((ele) => {
                resId.push([ele.to, ele._id]);
            })
        }

        return res.json({ success: true, message: "Docs sended Successfully", resId })
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }
}

const setDisappear = async (req, res) => {
    try {
        const disappear = req.body.disappear;
        const userId = req.userId;

        if (!disappear) {
            throw new Error("Value is missing!");
        }

        console.log(disappear);
        await user.updateOne({ _id: userId }, { disappear });

        return res.json({ success: true, message: "Disappear updated successfully" });

    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
}

const registerToken = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            throw new Error("Token is not there");
        }

        await tokenCollection.updateOne({ _id: req.userId }, { $set: { token } }, { upsert: true })

        return res.json({ success: true, message: "Token Registered Successfully" });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }
}

const sendNotification = async (req, res) => {
    try {
        const { title, body, arr_id } = req.body;

        if (!title || !body) {
            throw new Error("An error occurred while sending the notification.")
        }

        if (arr_id.length < 0) {
            throw new Error("An error occurred while sending the notification.")
        }

        const tokenDoc = await tokenCollection.find({ _id: { $in: arr_id } }).select({ token: 1 }).lean()

        if (!tokenDoc || !tokenDoc.length) {
            throw new Error("No token found for this user.")
        }

        const tokens = tokenDoc.map((ele)=>ele.token);

       const message = {
            data: {
                title: title,
                body: body,
            },
            tokens
        }

        await admin.messaging().sendEachForMulticast(message);

        return res.json({ success: true, message: "Message Sent Successfully" })
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }
}

export { searchUser, sendRequest, acceptRequest, sendRequestCancel, recievedRequestCancel, deleteUserfromrequestsent, deleteUserfromrequestrecieved, deleteSendedDocs, deleteRecievedDocs, sendDocs, setDisappear, registerToken, sendNotification }