import User from '../models/user.model.js'
import bcryptjs from 'bcrypt'

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
        res.status(500).json({
            success: false,
            message: `${error.message}`
        })
    }
}