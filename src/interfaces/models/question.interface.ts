import { Document, Types, ObjectId } from 'mongoose';

interface SubscribersInterface extends Types.Subdocument {
  user: string;
  createdAt?: Date | number;
}

interface PostInterface {
  posts: ObjectId;
}

interface QuestionInterface extends Document {
  title: string;
  slug: string;
  tags?: string;
  user: ObjectId;
  subscribers: Types.DocumentArray<SubscribersInterface>;
  posts: [PostInterface];
  createdAt?: Date | number;
}

export default QuestionInterface;
