import config from '../../config';
import DatabaseInterface from '../../interfaces/database.interface';
import logger from '../logger.util';
import Mongo from './mongo';
import MongoMemory from './mongoMemory';

export default class DatabaseFactory {
  public DatabaseDriver: DatabaseInterface;

  public constructor() {
    const { environment } = config;

    if (environment === 'test') {
      this.DatabaseDriver = new MongoMemory();
    } else {
      this.DatabaseDriver = new Mongo();
    }
  }

  public async connect(): Promise<void> {
    try {
      await this.DatabaseDriver.connect();
      this.logReport('Database connected');
    } catch (error) {
      this.logReport(error);
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.DatabaseDriver.disconnect();
      this.logReport('Database disconnected');
    } catch (error) {
      this.logReport(error);
    }
  }

  private logReport(log: string | any) {
    if (log instanceof Error) {
      return logger.error(log.stack || log);
    }

    if (config.environment !== 'test') {
      return console.log(log);
    }
  }
}
