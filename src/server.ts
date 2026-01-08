'use strict'

import app from './app'
import { Config } from './config/index'
import logger from './config/logger'

const startServer = () => {
    const PORT = Config.PORT
    try {
        app.listen(PORT, () => {
            logger.info('Listing on ', { port: PORT })
        })
    } catch (error) {
        logger.error(error)
        process.exit(1)
    }
}

startServer()
