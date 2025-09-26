import mongoose from "mongoose";

const loginSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    challenge: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: {
            expires: 300
        }
    }
})

const loginChallenge = mongoose.models.loginChallenge || mongoose.model("loginChallenge", loginSchema);

export default loginChallenge;