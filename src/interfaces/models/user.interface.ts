import { Date, Document, Types } from 'mongoose';

export interface BaseUserInterface {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}

export interface UserInterface extends Document, BaseUserInterface {
  createdAt?: Date;
  updatedAt?: Date;
  getFullName(): string;
}

export interface UserLoginInterface {
  email: UserInterface['email'];
  password: UserInterface['password'];
}
