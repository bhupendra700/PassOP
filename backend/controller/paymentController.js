import razorpayInstance from '../config/razorpay.js'
import crypto from "crypto"
import dotenv from "dotenv"
dotenv.config()
import user from '../models/userModel.js'

const order = async (req, res) => {
    try {
        const { amount, currency } = req.body;

        if (!amount || !currency) {
            throw new Error("Payment Failed");
        }

        const options = {
            amount: amount * 100,
            currency
        }

        const createdOrder = await razorpayInstance.orders.create(options);

        return res.json({ success: true, message: "Successfully created order", createdOrder })
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
}

const verify_payment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan_type } = req.body;
        const userId = req.userId;

        const generated_signature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET_ID).update(razorpay_order_id + "|" + razorpay_payment_id).digest("hex");

        if (generated_signature === razorpay_signature) {
            const currentDate = new Date();
            const oneYearLater = new Date(currentDate);
            oneYearLater.setFullYear(currentDate.getFullYear() + 1);

            await user.findByIdAndUpdate(userId, { $set: { plan_type, plan_expiry: plan_type === "Pro" ? oneYearLater : null } });

            return res.json({ success: true, message: "Verification Done." })
        } else {
            throw new Error("Verification failed")
        }

    } catch (error) {
        console.log(error.stack);
        return res.status(400).json({ success: false, message: error.message })
    }
}

export { order, verify_payment }