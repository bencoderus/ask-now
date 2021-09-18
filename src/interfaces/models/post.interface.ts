import { ObjectId, Document, Types } from 'mongoose';

interface VoteInterface extends Types.Subdocument {
  type: vote;
  user: ObjectId;
}

interface PostInterface extends Document {
  content: string;
  image?: string;
  isFirst: boolean;
  isBestAnswer: boolean;
  user: ObjectId;
  question: ObjectId;
  votes: [VoteInterface];
  createdAt?: Date | number;
}

export default PostInterface;
