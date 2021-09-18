import { Schema, model } from 'mongoose';
import UserInterface from '../interfaces/models/user.interface';

const schemaOptions = {
  toJSON: {
    transform: function (doc: any, resource: any) {
      resource.id = resource._id;
      delete resource.password;
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
        createdAt: { type: Date, default: Date.now }
      }
    ],
    createdAt: { type: Date, default: Date.now }
  },
  schemaOptions
);

const User = model<UserInterface>('User', schema);

export default User;
