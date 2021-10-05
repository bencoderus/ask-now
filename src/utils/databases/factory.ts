import config from '../../config';
import DatabaseInterface from '../../interfaces/database.interface';
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
      console.log('Database connected');
    } catch (error) {
      console.error(error);
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.DatabaseDriver.disconnect();
      console.log('Database disconnected');
    } catch (error) {
      console.error(error);
    }
  }
}
