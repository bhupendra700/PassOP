import mongoose, { Schema } from "mongoose"

const shareSchema = new Schema({
    from : {
        type : String,
        required : true,
    },
    to : {
        type : String,
        required : true,
    },
    passwordId : {
        type : String,
        required : true,
    },
    expiredAt : {
        type : Date,
        expires : 0,
    },
    createdAt : {
        type : Date,
        default: Date.now
    }
})

const share = mongoose.models.share || mongoose.model("share", shareSchema);

export default share;