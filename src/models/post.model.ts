import { Schema, model } from 'mongoose';
import PostInterface from '../interfaces/models/post.interface';
import User from './user.model';

const schemaOptions = {
  toJSON: {
    virtuals: true,
    transform: function (doc: any, resource: any) {
      resource.id = resource._id;
      delete resource.votes;
      delete resource.__v;
      delete resource._id;
    }
  }
};

const schema = new Schema<PostInterface>(
  {
    content: { type: 'string', required: true },
    image: { type: 'string' },
    isFirst: { type: 'boolean', default: false },
    isBestAnswer: { type: 'boolean', default: false },
    user: { type: Schema.Types.ObjectId, ref: User, required: true },
    question: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    votes: [
      {
        type: { type: 'string', required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
      }
    ],
    createdAt: { type: Date, default: Date.now }
  },
  schemaOptions
);

schema.virtual('voteDifference').get(function (this: any) {
  const downCount = this.votes.reduce((sum: number, vote: any) => {
    if (vote.type === 'down') sum += 1;
    return sum;
  }, 0);

  return this.votes.length - downCount;
});

const post = model<PostInterface>('Post', schema);

export default post;
