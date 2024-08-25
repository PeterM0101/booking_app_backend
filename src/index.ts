import express, {Request, Response} from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import userRoutes from './routes/users'
import authRoutes from './routes/auth'
import cookiesParser from 'cookie-parser';
import path from "node:path";

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => {
    console.log("Connected to database: ", process.env.MONGODB_CONNECTION_STRING)
})
const app = express();

app.use(cookiesParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

// app.use(express.static(path.join(__dirname, "../../frontend/.next")))

app.get('/api/test', async (req: Request, res: Response) =>
{
    res.status(200).json({message: 'Hello World!'})
})

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

app.listen(7000, () => {
    console.log('The server has been launched!')
})