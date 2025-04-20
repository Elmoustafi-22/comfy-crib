import User from '../models/user.model.js'
import bcryptjs from 'bcrypt'
import { errorHandler } from '../utils/error.js';

export const signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = bcryptjs.hashSync(password, salt)
        const newUser = new User({ username, email, password: hashedPassword });
    
        await newUser.save()
        res.status(200).json({
            message: "user created successfully"
        }) 
        
    } catch (error) {
       next(errorHandler(500, 'Error in creating user') )
    }
}