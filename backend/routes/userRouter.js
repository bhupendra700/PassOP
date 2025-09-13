import express from "express"
import { addPass , addCollection, renameCollection, deleteCollection, addPasswordInCollection, deletePasswordFromCollection, deletePass, editPass, contactUs, addEmail, addCard, editCard } from "../controller/userController.js";
import tokenValidation from "../middleware/tokenValidation.js";
import { addCardValidation, addEmailValidation, addPassValidation, contactValid } from "../middleware/ZodValidation.js";

const userRouter = express.Router();

//password part
userRouter.post('/addpass' , tokenValidation , addPassValidation , addPass);
userRouter.post('/editpass', tokenValidation ,addPassValidation , editPass);

userRouter.post('/addemail' , tokenValidation , addEmailValidation , addEmail);
userRouter.post('/editemail', tokenValidation ,addEmailValidation , editPass);

userRouter.post('/addcard' , tokenValidation , addCardValidation , addCard);
userRouter.post('/editcard' , tokenValidation , addCardValidation , editCard);

userRouter.post('/deletepass' ,tokenValidation , deletePass);

//collection part
userRouter.post('/addcollection' ,tokenValidation , addCollection);
userRouter.post('/renamecollection' ,tokenValidation , renameCollection);
userRouter.post('/deletecollection' ,tokenValidation , deleteCollection);
userRouter.post('/addpasswordincollection' ,tokenValidation , addPasswordInCollection);
userRouter.post('/deletepasswordfromcollection' ,tokenValidation , deletePasswordFromCollection);

//contactus part
userRouter.post('/contactus' , contactValid, contactUs);

export default userRouter;