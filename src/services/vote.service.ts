import { isValidObjectId } from 'mongoose';
import HttpException from '../exceptions/http.exception';
import PostInterface from '../interfaces/models/post.interface';
import Post from '../models/post.model';
import constants from '../utils/constants';
import NotificationService from './notification.service';

export default class VoteService {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  public async vote(
    postId: any,
    user: any,
    type: vote
  ): Promise<PostInterface> {
    if (!isValidObjectId(postId)) {
      throw new HttpException(constants.postNotFound, 404);
    }

    const post: any = await Post.findById(postId)
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

    const alreadyVoted = post.votes.find(
      (vote: any) => vote.user.toString() === user.id && vote.type === type
    );

    if (alreadyVoted) {
      throw new HttpException(constants.alreadyVoted, 403);
    }

    const reversedVoted = post.votes.find(
      (vote: any) => vote.user.toString() === user.id && vote.type === reversed
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

  public async delete(postId: any, user: any): Promise<boolean> {
    if (!isValidObjectId(postId)) {
      throw new HttpException(constants.postNotFound, 404);
    }

    const post = await Post.findById(postId);

    if (!post) {
      throw new HttpException(constants.postNotFound, 404);
    }

    const hasVoted = post.votes.find(
      (vote) => vote.user.toString() === user.id
    );

    if (!hasVoted) {
      throw new HttpException(constants.notVoted, 403);
    }

    await post.updateOne({ $pull: { votes: { user: user.id } } });

    return true;
  }
}
