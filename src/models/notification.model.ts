import { Schema, model } from 'mongoose';
import { NotificationInterface } from '../interfaces/models/notification.interface';

const schemaOptions = {
  toJSON: {
    transform(doc: any, resource: any) {
      resource.id = resource._id;
      delete resource.__v;
      delete resource._id;
    }
  },
  timestamps: true
};

const schema: Schema = new Schema<NotificationInterface>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  schemaOptions
);

const Notification = model<NotificationInterface>('Notification', schema);

export default Notification;
