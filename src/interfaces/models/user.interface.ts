import { Date, Document, Types } from 'mongoose';

export interface NotificationInterface extends Types.Subdocument {
  title: string;
  content: string;
  read: boolean;
  createdAt?: Date;
}

export interface UserInterface extends Document {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  notifications: Types.DocumentArray<NotificationInterface>;
  createdAt?: Date;
  getFullName(): string;
}
