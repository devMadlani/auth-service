import 'reflect-metadata'
import express from 'express'
import cookieParse from 'cookie-parser'
import authRouter from './routes/auth'
import tenantsRouter from './routes/tenant'
import userRouter from './routes/user'
import path from 'path'
import cors from 'cors'
import { globalErrorHandler } from './middlewares/globalErrorHandler'

const app = express()

app.use(
    cors({
        origin: ['http://localhost:5173'],
        credentials: true,
    }),
)

app.use(
    express.static(path.join(__dirname, '..', 'public'), {
        dotfiles: 'allow',
    }),
)
app.use(cookieParse())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Welcome')
})

app.use('/auth', authRouter)
app.use('/tenants', tenantsRouter)
app.use('/users', userRouter)

app.use(globalErrorHandler)

export default app
