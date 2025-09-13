import jwt from 'jsonwebtoken'
import user from '../models/userModel.js';

const tokenValidation = async (req, res , next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            throw new Error("Authentication token is missing.");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded.id) {
            throw new Error("Invalid or expired authentication token.");
        }

        const userExists = await user.findById(decoded.id).select("_id");
        if (!userExists) {
            throw new Error("User not found.");
        }

        req.userId = decoded.id;

        next();
    } catch (error) {
        return res.status(400).json({ success: false, type:"normal" , message: error.message })
    }
}

export default tokenValidation;