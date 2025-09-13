import { success, z } from "zod"

//auth zod validation
const zodRegister = z.object({
    name: z.string().min(5, "Name must be at least 5 characters long"),
    email: z.email(),
    password: z.string().min(8, "Password must be at least 8 characters long")
})

const registerValid = (req, res, next) => {
    try {
        zodRegister.parse(req.body);
        next()
    } catch (error) {
        return res.status(400).json({
            success: false, type: "zod", message: error.issues.map(e => e.message)
        });
    }
}

const zodLogin = z.object({
    email: z.email(),
    password: z.string().min(8, "Password must be 8 charcter long")
})

const loginValid = (req, res, next) => {
    try {
        zodLogin.parse(req.body);
        next()
    } catch (error) {
        return res.status(400).json({
            success: false, type: "zod", message: error.issues.map(e => e.message)
        });
    }

}

export { registerValid, loginValid }

//AddPassword zod validation
const addPassValidationSchema = z.object({
    url: z.string().min(2, "url or App name must be 2 character long"),
    username: z.string().min(2, "username must be 2 character long"),
    password: z.string().min(8, "password must be 8 character long")
})

const addPassValidation = (req, res, next) => {
    try {
        addPassValidationSchema.parse(req.body.docs);
        next()
    } catch (error) {
        return res.status(400).json({ success: false, type: "zod", message: error.issues.map((ele) => ele.message) });
    }
}

const addEmailValidationSchema = z.object({
    email: z.email(),
    password: z.string().min(8, "password must be 8 character long")
})

const addEmailValidation = (req, res, next) => {
    try {
        addEmailValidationSchema.parse(req.body.docs);
        next()
    } catch (error) {
        return res.status(400).json({ success: false, type: "zod", message: error.issues.map((ele) => ele.message) });
    }
}

const addCardValidationSchema = z.object({
    card_holder_name : z.string().min(5 , "Please enter a valid card holder name (minimum 5 characters)."),
    card_number : z.string().refine((val)=>{
        return val.replace(/\s/g , "").length === 16;
    },{message : "Card number should contain exactly 16 digits."})
    .refine((val)=>{
        const newValue = val.replace(/\s/g , "")
        const regex = /\D/g; 
        return !regex.test(newValue);
    } , {message : "Invalid card number. Only numeric digits are allowed."}),

    expiry_date : z.string().refine((val)=>{
        const [month , year] = val.split("/").map((ele)=>ele.trim())
        const cardDate = new Date(2000+parseInt(year) , month - 1);
        const currDate = new Date();
        return currDate <= cardDate;
    } , {message : "Card has expired. Please enter a valid expiry date."})
    .refine((val)=>{
        const regex = /^(0[0-9]|1[0-2])\s?\/\s?[0-9]{2}$/
        return regex.test(val);
    } , {message : "Expiry date must be in MM/YY format (e.g., 05/27)."}),
})

const addCardValidation = (req, res, next) => {
    try {
        addCardValidationSchema.parse(req.body.docs);
        next()
    } catch (error) {
        return res.status(400).json({ success: false, type: "zod", message: error.issues.map((ele) => ele.message) });
    }
}

export { addPassValidation , addEmailValidation , addCardValidation}

//contactus zod validation
const contactValidSchema = z.object({
    name: z.string().min(5, "Name must be at least 5 characters long"),
    email: z.email(),
    message: z.string().min(10, "Message must be at least 10 characters long")
})

const contactValid = (req, res, next) => {
    try {
        contactValidSchema.parse(req.body);
        next()
    } catch (error) {
        return res.status(400).json({ success: false, type: "zod", message: error.issues.map((ele) => ele.message) });
    }
}

export { contactValid }
