import app from './app';
import config from './config';
import logger from './utils/logger.util';
import DatabaseFactory from './utils/databases/factory';

process.on('uncaughtException', (error) => logger.error(error.stack));
process.on('unhandledRejection', (error) => logger.error(error));

app
  .listen(config.port, async () => {
    const database = new DatabaseFactory();
    await database.connect();

    console.log(`${config.name} is running on ${config.port} 🚀`);
  })
  .on('error', (err) => logger.error(err.stack));
