import app from './app'
import { AppDataSource } from './config/data-source'
import { Config } from './config/index'
import logger from './config/logger'

export const startServer = async () => {
    const PORT = Config.PORT
    try {
        await AppDataSource.initialize()
        logger.info('Database connected successfully.')
        app.listen(PORT, () => {
            logger.info('Listing on ', { port: PORT })
        })
    } catch (error) {
        logger.error(error)
        process.exit(1)
    }
}

void startServer()
