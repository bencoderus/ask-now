import { Schema, model } from 'mongoose';
import { QuestionInterface } from '../interfaces/models/question.interface';
import Post from './post.model';
import User from './user.model';

const schemaOptions = {
  toJSON: {
    transform(doc: any, resource: any) {
      resource.id = resource._id;
      if (!doc.populated('subscribers')) {
        delete resource.subscribers;
      }

      if (!doc.populated('posts')) {
        delete resource.posts;
      }
      delete resource.__v;
      delete resource._id;
    }
  }
};

const schema = new Schema<QuestionInterface>(
  {
    title: { type: 'string', required: true },
    slug: { type: 'string', required: true },
    tags: { type: 'string', required: false },
    user: { type: Schema.Types.ObjectId, ref: User, required: true },
    posts: [{ type: Schema.Types.ObjectId, ref: Post }],
    subscribers: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    createdAt: { type: Date, default: Date.now }
  },
  schemaOptions
);

const question = model<QuestionInterface>('Question', schema);

export default question;
