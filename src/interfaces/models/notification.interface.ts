import { Date, Document } from 'mongoose';
import { UserInterface } from './user.interface';

export interface NotificationInterface extends Document {
  title: string;
  content: string;
  read: boolean;
  user: UserInterface['_id'];
  createdAt?: Date;
  updatedAt?: Date;
}
