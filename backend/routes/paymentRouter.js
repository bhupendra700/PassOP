import express from "express"
import { order, verify_payment } from "../controller/paymentController.js";
import tokenValidation from "../middleware/tokenValidation.js"

const paymentRouter = express.Router();

//creating order
paymentRouter.post('/create-order', order);

paymentRouter.post('/verify-payment', tokenValidation, verify_payment)

export default paymentRouter