import { ObjectId } from 'mongoose';

type ratingType = 'up' | 'down';

interface RatingInterface {
  type: ratingType;
  user: ObjectId;
}

interface PostInterface {
  content: string;
  isFirst: boolean;
  isBestAnswer: boolean;
  user: ObjectId;
  question: ObjectId;
  ratings: [RatingInterface];
  createdAt?: Date | number;
}

export default PostInterface;
