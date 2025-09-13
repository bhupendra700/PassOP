import express from "express"
import { delUser, isLoggedIn, Logout, register, sendOpt, setnewPassword, userlogin, verifyOtp} from "../controller/authController.js";
import { loginValid, registerValid } from "../middleware/ZodValidation.js";

const authRouter = express.Router();

authRouter.post('/register', registerValid, register);
authRouter.post('/login', loginValid, userlogin);
authRouter.get('/islogin', isLoggedIn);
authRouter.get('/logout', Logout)
authRouter.delete('/delUser', delUser)
authRouter.post('/sendotp', sendOpt)
authRouter.post('/verifyotp', verifyOtp)
authRouter.post('/setnewpassword', setnewPassword)

export default authRouter;