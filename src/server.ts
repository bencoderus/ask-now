import app from './app';
import config from './config';
import logger from './utils/logger';
import DatabaseManager from './utils/database-manger';

process.on('uncaughtException', (error) => logger.error(error));
process.on('unhandledRejection', (error) => logger.error(error));

app
  .listen(config.port, async () => {
    logger.error(`Server started on port ${config.port}`);
    await DatabaseManager.connect();
    logger.info(`${config.name} is running on ${config.port} 🚀`);
  })
  .on('error', (err) => logger.error(err));
