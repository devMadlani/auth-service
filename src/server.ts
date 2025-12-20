'use strict'

import app from './app'
import { Config } from './config/index'
import logger from './config/logger'

const startServer = () => {
    const PORT = Config.PORT
    try {
        app.listen(PORT, () => {
            logger.error('error')
            logger.warn('hello')
            logger.info('Listing on port', { port: PORT })
        })
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

startServer()
