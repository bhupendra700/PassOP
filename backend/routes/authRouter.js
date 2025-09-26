import express from "express"
import { createLoginOption, createRegistrationOption, delete2FAVerify, deletePasskey, delUser, disable2FA, generateQRCode, googleLogin, isLoggedIn, Logout, register, send2FAotp, sendOpt, setnewPassword, twoFA_varify, twoFALogin, userlogin, verify2FAotp, verifyAuthenticatorOTP, verifyLoginChallenge, verifyOtp, verifyRegisterChallenge } from "../controller/authController.js";
import { loginValid, registerValid } from "../middleware/ZodValidation.js";
import tokenValidation from '../middleware/tokenValidation.js'

const authRouter = express.Router();

authRouter.post('/register', registerValid, register);
authRouter.post('/login', loginValid, userlogin);
authRouter.get('/islogin', isLoggedIn);
authRouter.get('/logout', Logout)
authRouter.delete('/delUser/:email', tokenValidation, delUser)
authRouter.post('/sendotp', sendOpt)
authRouter.post('/verifyotp', verifyOtp)
authRouter.post('/setnewpassword', setnewPassword)

//enable 2FA
authRouter.post('/generateQRCode', tokenValidation, generateQRCode)
authRouter.post('/twoFA_varify', tokenValidation, twoFA_varify)

//disable 2FA
authRouter.post('/disable2FA', tokenValidation, disable2FA);

//handle 2FA Login
authRouter.post('/twoFALogin', twoFALogin);

//Reset Two-Factor Authentication
authRouter.post('/send2FAotp', send2FAotp); //step - 1
authRouter.post('/verify2FAotp', verify2FAotp); //step - 2
authRouter.post('/verifyAuthenticatorOTP', verifyAuthenticatorOTP); //step - 3

//google login
authRouter.post('/google_login', googleLogin);

//delete user ko vrify agar 2FA on hai
authRouter.post('/delete2FAVerify', tokenValidation , delete2FAVerify);


//Adding passkey Router

//regeter passkey
//1.creating option
authRouter.get('/createOption' , tokenValidation , createRegistrationOption)

//2.verifying option
authRouter.post('/verifyRegisterChallenge' , tokenValidation , verifyRegisterChallenge)


//login passkey
//1.creating option
authRouter.post('/createLoginOption' , createLoginOption);

//2.verifying option
authRouter.post('/verifyLoginChallenge' , verifyLoginChallenge);


//delete passkey
authRouter.patch('/deletePasskey' , tokenValidation , deletePasskey)

export default authRouter;