import { Schema, model } from 'mongoose';
import { UserInterface } from '../interfaces/models/user.interface';

const schemaOptions = {
  toJSON: {
    transform(doc: any, resource: any) {
      resource.id = resource._id;
      delete resource.password;
      delete resource.notifications;
      delete resource.__v;
      delete resource._id;
    }
  }
};

const schema: Schema = new Schema<UserInterface>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    notifications: [
      {
        title: { type: String, required: true },
        content: { type: String, required: true },
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    createdAt: { type: Date, default: Date.now }
  },
  schemaOptions
);

schema.methods.getFullName = (user: UserInterface) => {
  return `${user.firstName} ${user.lastName}`;
};

const User = model<UserInterface>('User', schema);

export default User;
