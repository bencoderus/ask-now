import { injectable } from 'tsyringe';
import { isValidObjectId } from 'mongoose';
import HttpException from '../exceptions/http.exception';
import {
  PostInterface,
  VoteInterface
} from '../interfaces/models/post.interface';
import { UserInterface } from '../interfaces/models/user.interface';
import Post from '../models/post.model';
import constants from '../utils/constants';
import NotificationService from './notification.service';
import { vote } from '../types/custom';

@injectable()
export default class VoteService {
  constructor(private notificationService: NotificationService) {}

  public async vote(
    postId: string,
    user: UserInterface,
    type: vote
  ): Promise<PostInterface> {
    if (!isValidObjectId(postId)) {
      throw new HttpException(constants.postNotFound, 404);
    }

    const post: PostInterface | null = await Post.findById(postId)
      .populate('question')
      .populate('user');

    if (!post) {
      throw new HttpException(constants.postNotFound, 404);
    }

    if (post.user.toString() === user.id) {
      throw new HttpException(constants.canNotVoteYourself, 403);
    }

    const reversed: string =
      type === constants.votes.up ? constants.votes.down : constants.votes.up;

    const alreadyVoted: boolean = post.votes.some(
      (voteRecord: VoteInterface) =>
        voteRecord.user.toString() === user.id && voteRecord.type === type
    );

    if (alreadyVoted) {
      throw new HttpException(constants.alreadyVoted, 403);
    }

    const reversedVoted: VoteInterface | undefined = post.votes.find(
      (voteRecord: VoteInterface) =>
        voteRecord.user.toString() === user.id && voteRecord.type === reversed
    );

    if (reversedVoted) {
      await Post.updateOne(
        { _id: postId, 'votes._id': reversedVoted._id },
        { $set: { 'votes.$.type': type } }
      );

      await this.notificationService.sendVoteNotification(post, user, type);

      return post;
    }

    await Post.updateOne(
      { _id: postId },
      { $push: { votes: { type, user: user.id } } }
    );

    await this.notificationService.sendVoteNotification(post, user, type);

    return post;
  }

  public async delete(postId: string, user: UserInterface): Promise<boolean> {
    if (!isValidObjectId(postId)) {
      throw new HttpException(constants.postNotFound, 404);
    }

    const post = await Post.findById(postId);

    if (!post) {
      throw new HttpException(constants.postNotFound, 404);
    }

    const hasVoted: boolean = post.votes.some(
      (voteRecord: VoteInterface) => voteRecord.user.toString() === user.id
    );

    if (!hasVoted) {
      throw new HttpException(constants.notVoted, 403);
    }

    await post.updateOne({ $pull: { votes: { user: user.id } } });

    return true;
  }
}
