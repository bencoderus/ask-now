import { Document, Types } from 'mongoose';
import { PostInterface } from './post.interface';
import { UserInterface } from './user.interface';

export interface SubscribersInterface extends Types.Subdocument {
  user: string;
  createdAt?: Date | number;
}

export interface QuestionInterface extends Document {
  title: string;
  slug: string;
  tags?: string;
  user: UserInterface['_id'];
  subscribers: Types.DocumentArray<SubscribersInterface>;
  posts: Types.DocumentArray<PostInterface>;
  createdAt?: Date | number;
}
