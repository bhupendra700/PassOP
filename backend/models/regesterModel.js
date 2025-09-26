import mongoose from "mongoose";

const regesterSchema = new mongoose.Schema({
    userId : {
        type : String,
        required : true
    },
    challenge : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now,
        index : {
            expires : 300
        }
    }
})

const regesterChallenge = mongoose.models.regesterChallenge || mongoose.model("regesterChallenge", regesterSchema);

export default regesterChallenge;