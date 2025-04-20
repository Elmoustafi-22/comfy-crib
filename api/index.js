import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js';

dotenv.config()
const app = express();

app.use(express.json())

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`The localhost is live on: http://localhost:${PORT}`)
})

app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)

mongoose.connect(process.env.MONGO_URI, {
    dbName: 'comfy-crib-db',
    bufferCommands: true
}).then(() => {
    console.log('Connected to MongoDB!')
}).catch((error) => {
    console.error(error)
})