import user from "../models/userModel.js";
import CryptoJS from "crypto-js";

const recievedFunc = async(userDB, sharedArr) => {
    let recievedDocs = [];  // [{_id : shareId , from : otherUser , to : me , passwordId(_id) , createdAt , expiredAt}]
    if (sharedArr?.length !== 0) {
        recievedDocs = sharedArr?.filter((docs) => {
            return docs.to === userDB._id;
        });
    }

    const recievedDocsUser = (recievedDocs || []).map((ele) => { //[from1 , from2 , from3 , ...];
        return ele.from;
    })

    const userDetails = new Map(); //["from1" => {userId : from , userName , userEmail , userPhotoURL}]

    const AllRecievedPasswords = new Map(); //["passwordId : _id" => {_id:passwordId , doctype , email , password , url , username , notes , card_holder_name , card_number , expiry_date , card_type , bankUrl , bankName , brandUrl , brandName} , ...];

    for (let i = 0; i < recievedDocsUser.length; i++) {
        const fromwalaUser = await user.findOne({ _id: recievedDocsUser[i] }).lean(); //{_id : from , email , name , photoURL , disappear , collections , AllPasswords ,...};

        userDetails.set(fromwalaUser._id, {userId : fromwalaUser._id , userName : fromwalaUser.name , userEmail : fromwalaUser.email , userPhotoURL : fromwalaUser.photoURL});

        for(let j=0 ; j<fromwalaUser.AllPassword.length ; j++){
            const currentPassword = fromwalaUser.AllPassword[j];

             const obj = {
                _id : currentPassword._id,
                Doctype : currentPassword.Doctype, 
             }

            if(currentPassword.Doctype === "email"){
                obj.email = currentPassword.email,
                obj.password = CryptoJS.AES.decrypt(currentPassword.password, process.env.CRYPTO_SECRET_KEY).toString(CryptoJS.enc.Utf8),
                obj.notes = currentPassword.notes
            }else if(currentPassword.Doctype === "password"){
                obj.url = currentPassword.url,
                obj.username = currentPassword.username,
                obj.notes = currentPassword.notes,
                obj.password = CryptoJS.AES.decrypt(currentPassword.password, process.env.CRYPTO_SECRET_KEY).toString(CryptoJS.enc.Utf8)
            }else{
                obj.card_holder_name = CryptoJS.AES.decrypt(currentPassword.card_holder_name, process.env.CRYPTO_SECRET_KEY).toString(CryptoJS.enc.Utf8),
                obj.card_number = CryptoJS.AES.decrypt(currentPassword.card_number, process.env.CRYPTO_SECRET_KEY).toString(CryptoJS.enc.Utf8),
                obj.expiry_date = currentPassword.expiry_date,
                obj.brandUrl = currentPassword.brandUrl,
                obj.brandName = currentPassword.brandName,
                obj.card_type = currentPassword.card_type,
                obj.bankUrl = currentPassword.bankUrl,
                obj.bankName = currentPassword.bankName
            }

            AllRecievedPasswords.set(currentPassword._id , obj);
        }
    }

    let recievedResult = []; // [{shareId : _id , expiredAt , createdAt , userId : from , userEmail , userName , userPhotoURL , _id : passwordId , Doctype , email ,password , url , username , notes , card_holder_name , card_number , expiry_date , brandUrl , brandName , card_type , bankUrl , bankName} , {}]

    for (let i = 0; i < recievedDocs?.length; i++) {
        const docs = recievedDocs[i];

        let obj = {
            shareId: docs._id,
            createdAt : docs.createdAt,
            userId : docs.from,
            userEmail : userDetails.get(docs.from).userEmail || "",
            userName : userDetails.get(docs.from).userName || "",
            userPhotoURL : userDetails.get(docs.from).userPhotoURL || "",
        }

        if(docs?.expiredAt){
            obj.expiredAt = docs.expiredAt;
        }

        const passObj = AllRecievedPasswords.get(docs.passwordId);

        obj = {...obj , ...passObj};

        recievedResult.push(obj);
    }

    return recievedResult
}

export default recievedFunc;