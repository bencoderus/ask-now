import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import DatabaseInterface from '../../interfaces/database.interface';

export default class MongoMemory implements DatabaseInterface {
  private connection: any;

  public async connect(): Promise<void> {
    this.connection = await MongoMemoryServer.create();
    const uri = this.connection.getUri();

    await mongoose.connect(uri);
  }

  public async disconnect(): Promise<void> {
    await mongoose.connection.close();
    await this.connection.stop();
  }
}
