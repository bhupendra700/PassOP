import mongoose, { Schema } from "mongoose";
import { v4 as uuid } from 'uuid';

const AllPasswordSchema = new Schema({
    _id: {
        type: String,
        default: () => uuid(),
    },
    Doctype: {
        type: String,
        required: true,
    },
    //password cat
    url: {
        type: String,
    },
    username: {
        type: String,
    },
    //email cat
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    notes: {
        type: String,
    },
    //card cat
    card_holder_name: {
        type: String,
    },
    card_number: {
        type: String,
    },
    expiry_date: {
        type: String,
    },
    brandUrl: {
        type: String,
    },
    brandName: {
        type: String,
    },
    card_type: {
        type: String,
    },
    bankUrl: {
        type: String,
    },
    bankName: {
        type: String,
    },
}, { _id: false });

const collectionSchema = new Schema({
    _id: {
        type: String,
        default: () => uuid()
    },
    name: {
        type: String,
        required: true
    },
    passwordID: {
        type: [String],
        default: []
    }
}, { _id: false });

const sendSchema = new Schema({
    _id: {
        type: String,
        default: () => uuid()
    },
    userId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    photoURL: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
} , {_id : false})

const recievedSchema = new Schema({
    _id: {
        type: String,
        default: () => uuid()
    },
    userId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    photoURL: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
} , {_id : false})

const userSchema = new Schema({
    _id: {
        type: String,
        default: () => uuid()
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    photoURL: {
        type: String,
        default: "green", // ya koi image URL
    },
    otp: {
        type: String,
        default: "",
    },
    otpExpireAt: {
        type: Date,
        default: null,
    },
    collections: {
        type: [collectionSchema],
        default: [{ name: "All" }]
    },
    AllPassword: {
        type: [AllPasswordSchema],
        default: []
    },
    disappear: {
        type: String,
        default: "7 Days",
    },
    send: {
        type: [sendSchema],
        default: [],
    },
    recieved: {
        type: [recievedSchema],
        default: [],
    }
});

const user = mongoose.models.user || mongoose.model("user", userSchema);

export default user;