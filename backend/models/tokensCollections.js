import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    token: { type: String, required: true }
});

const tokenCollection =
    mongoose.models.tokenCollection || mongoose.model("tokenCollection", tokenSchema);

export default tokenCollection;
