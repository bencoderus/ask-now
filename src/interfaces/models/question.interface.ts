import { Document, Types } from 'mongoose';
import { PostInterface } from './post.interface';
import { UserInterface } from './user.interface';

export interface SubscribersInterface extends Types.Subdocument {
  user: string;
  createdAt?: Date | number;
}

export interface BaseQuestionInterface {
  title: string;
  slug: string;
  tags?: string;
  user: UserInterface['_id'];
}

export interface QuestionInterface extends Document, BaseQuestionInterface {
  subscribers: Types.DocumentArray<SubscribersInterface>;
  posts: Types.DocumentArray<PostInterface>;
  createdAt?: Date;
  updatedAt?: Date;
}
