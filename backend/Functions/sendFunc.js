import user from "../models/userModel.js";
import CryptoJS from "crypto-js";

const sendFunc = async (userDB, sharedArr) => { //shareArr -> jo jo share aur recieved kiya hai recordes

    let sendDocs = [];  //maine konse docs ko share kiya hu e.g:- [{_id , from : userDB._id, to : user1 , passwordId , epiresAt , createdAt} , {}]
    if (sharedArr.length !== 0) {
        sendDocs = sharedArr.filter((docs) => {
            return docs.from === userDB._id;
        });
    }


    let AllPassword = new Map(); //["_id : passwordId" => {_id : passwordId , Doctype , email , password , url , username , notes , card_holder_name , card_number , expiry_date , brandUrl , brandName , card_type , bankUrl , bankName}]
    userDB.AllPassword.map((ele) => {
        let obj = { ...ele }; //{_id : passwordId , Doctype , email , password , url , username , notes , card_holder_name , card_number , expiry_date , brandUrl , brandName , card_type , bankUrl , bankName}

        if (obj.Doctype !== "card") {
            obj.password = CryptoJS.AES.decrypt(obj.password, process.env.CRYPTO_SECRET_KEY).toString(CryptoJS.enc.Utf8)
        } else {
            obj.card_holder_name = CryptoJS.AES.decrypt(obj.card_holder_name, process.env.CRYPTO_SECRET_KEY).toString(CryptoJS.enc.Utf8)

            obj.card_number = CryptoJS.AES.decrypt(obj.card_number, process.env.CRYPTO_SECRET_KEY).toString(CryptoJS.enc.Utf8)
        }

        AllPassword.set(obj._id, obj);

        return obj;
    });


    const sendUser = new Map(); //["userId" => {_id , userId , name , email , photoURL , status} , "userId" => {_id , userId , name , email , photoURL , status}]
    userDB.send.map((ele) => {
        sendUser.set(ele.userId, ele);
        return ele;
    })


    let sendResult = []; // [{shareId : _id , expiredAt , createdAt , userId : to , userEmail , userName , userPhotoURL , _id : passwordId , Doctype , email ,password , url , username , notes , card_holder_name , card_number , expiry_date , brandUrl , brandName , card_type , bankUrl , bankName} , {}]

    //sendDocs + AllPassword + sendUser
    for (let i = 0; i < sendDocs?.length; i++) {
        const currentPassword = AllPassword.get(sendDocs[i].passwordId);

        let obj = {
            shareId: sendDocs[i]._id,
            createdAt: sendDocs[i].createdAt,
            userId: sendDocs[i].to,
            userEmail: sendUser.get(sendDocs[i].to).email,
            userName: sendUser.get(sendDocs[i].to).name,
            userPhotoURL: sendUser.get(sendDocs[i].to).photoURL,
            _id : currentPassword?._id
        }

        if (sendDocs[i]?.expiredAt) {
            obj.expiredAt = sendDocs[i]?.expiredAt;
        }

        if (currentPassword.Doctype === "card") {
            let newObj = {
                Doctype: currentPassword.Doctype,
                card_holder_name: currentPassword.card_holder_name,
                card_number: currentPassword.card_number,
                card_type: currentPassword.card_type,
                expiry_date: currentPassword.expiry_date,
                brandUrl: currentPassword.brandUrl,
                brandName: currentPassword.brandName,
                bankUrl: currentPassword.bankUrl,
                bankName: currentPassword.bankName
            }

            obj = { ...obj, ...newObj };
        } else if (currentPassword.Doctype === "email") {
            let newObj = {
                Doctype: currentPassword.Doctype,
                email: currentPassword.email,
                password: currentPassword.password,
                notes: currentPassword.notes
            }

            obj = { ...obj, ...newObj };
        } else {
            let newObj = {
                Doctype: currentPassword.Doctype,
                url: currentPassword.url,
                username: currentPassword.username,
                password: currentPassword.password,
                notes: currentPassword.notes,
            }

            obj = { ...obj, ...newObj };
        }

        sendResult.push(obj);
    }
    return sendResult;
}

export default sendFunc;