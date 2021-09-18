import mongoose from 'mongoose';
import config from '../config';
import logger from './logger';

export default class DatabaseManager {
  public static async connect(): Promise<void> {
    mongoose
      .connect(config.mongoUri)
      .then(() => logger.info('Connected to MongoDB'))
      .catch((err: Error) => logger.error(err));
  }
}
