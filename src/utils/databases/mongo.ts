import mongoose from 'mongoose';
import config from '../../config';
import DatabaseInterface from '../../interfaces/database.interface';

export default class Mongo implements DatabaseInterface {
  public async connect(): Promise<void> {
    await mongoose.connect(config.mongoUri);
  }

  public async disconnect(): Promise<void> {
    await mongoose.connection.close();
  }
}
