import { ObjectId, Document, Types } from 'mongoose';
import { vote } from '../../types/custom';
import { QuestionInterface } from './question.interface';
import { UserInterface } from './user.interface';

export interface VoteInterface extends Types.Subdocument {
  type: vote;
  user: ObjectId;
}

export interface PostInterface extends Document {
  content: string;
  image?: string;
  isFirst: boolean;
  isBestAnswer: boolean;
  user: UserInterface['_id'];
  question: QuestionInterface['_id'];
  votes: Types.DocumentArray<VoteInterface>;
  createdAt?: Date | number;
}
