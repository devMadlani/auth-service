import 'reflect-metadata'
import express, { NextFunction, Request, Response } from 'express'
import cookieParse from 'cookie-parser'
import logger from './config/logger'
import { HttpError } from 'http-errors'
import authRouter from './routes/auth'
import path from 'path'

const app = express()

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

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message)
    const statusCode = err.statusCode || err.status || 500

    res.status(statusCode).json({
        errors: [
            {
                type: err.name,
                msg: err.message,
                path: '',
                location: '',
            },
        ],
    })
})

export default app
