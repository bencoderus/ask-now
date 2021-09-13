import { Date, Document } from 'mongoose';

interface NotificationInterface {
  code: string;
  title: string;
  content: string;
  createdAt?: Date;
}

export default interface UserInterface extends Document {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  notifications: [NotificationInterface];
  createdAt?: Date;
}
