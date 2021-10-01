import { Date, Document, Types } from 'mongoose';

export interface NotificationInterface extends Types.Subdocument {
  title: string;
  content: string;
  read: boolean;
  createdAt?: Date;
}

export interface BaseUserInterface {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}

export interface UserInterface extends Document, BaseUserInterface {
  notifications: Types.DocumentArray<NotificationInterface>;
  createdAt?: Date;
  getFullName(): string;
}

export interface UserLoginInterface {
  email: UserInterface['email'];
  password: UserInterface['password'];
}
