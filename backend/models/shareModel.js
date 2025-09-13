import mongoose, { Schema } from "mongoose"

const shareShema = new Schema({
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

const share = mongoose.models.shareShema || mongoose.model("share", shareShema);

export default share;