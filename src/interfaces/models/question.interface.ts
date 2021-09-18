import { Document, Types, ObjectId } from 'mongoose';

interface SubscribersInterface extends Types.Subdocument {
  user: string;
  createdAt?: Date | number;
}

interface QuestionInterface extends Document {
  title: string;
  slug: string;
  tags?: string;
  user: ObjectId;
  subscribers: Types.DocumentArray<SubscribersInterface>;
  posts: ObjectId[];
  createdAt?: Date | number;
}

export default QuestionInterface;
