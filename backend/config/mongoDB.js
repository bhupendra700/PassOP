import mongoose from "mongoose";

const connectDB = () => {
    mongoose.connect(`${process.env.MONGO_URI}/passop`).then(() => {
        console.log("MongoDB Connected SuccessFully");
    }).catch((error) => {
        console.log("MongoDB Error: ", error.message);
    })
}

export default connectDB