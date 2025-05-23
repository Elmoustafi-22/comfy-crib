import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'

dotenv.config()
const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`The localhost is live on: http://localhost:${PORT}`)
})

app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/listing', listingRouter);

mongoose.connect(process.env.MONGO_URI, {
    dbName: 'comfy-crib-db',
    bufferCommands: true
}).then(() => {
    console.log('Connected to MongoDB!')
}).catch((error) => {
    console.error(error)
})


app.use((err, req, res, next) => {
     const statusCode = err.statusCode || 500;
     const message = err.message || 'Internal Server Error';
     return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
     });
      
})