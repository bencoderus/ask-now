import { ObjectId } from 'mongoose';

interface SubscribersInterface {
  user: string;
}

interface PostInterface {
  posts: ObjectId;
}

interface QuestionInterface {
  title: string;
  slug: string;
  tags?: string;
  user: ObjectId;
  subscribers: [SubscribersInterface];
  posts: [PostInterface];
  createdAt?: Date | number;
}

export default QuestionInterface;
