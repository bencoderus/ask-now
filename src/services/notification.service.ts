import util from 'util';
import { isValidObjectId } from 'mongoose';
import HttpException from '../exceptions/http.exception';
import SubscriptionNotification from '../jobs/subscription.job';
import User from '../models/user.model';
import constants from '../utils/constants';

export default class NotificationService {
  public async findByUser(userId: any): Promise<any[]> {
    const user: any = await User.findById(userId)
      .select('notifications')
      .lean();

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return user.notifications;
  }

  public async markAsRead(notificationId: any, user: any): Promise<boolean> {
    if (!isValidObjectId(notificationId)) {
      throw new HttpException(
        util.format(constants.notFound, 'Notification'),
        404
      );
    }

    const userNotification = await User.findOne({
      _id: user.id,
      'notifications._id': notificationId
    }).select('notifications');

    if (!userNotification) {
      throw new HttpException(
        util.format(constants.notFound, 'Notification'),
        404
      );
    }

    await User.updateOne(
      {
        _id: user.id,
        'notifications._id': notificationId
      },
      {
        $set: { 'notifications.$.read': true }
      }
    );

    return true;
  }

  public async notifyReceiver(
    receiverId: any,
    title: string,
    content: string
  ): Promise<void> {
    await User.updateOne(
      { _id: receiverId },
      {
        $push: {
          notifications: {
            $each: [{ content, title }],
            $sort: { createdAt: -1 }
          }
        }
      }
    );
  }

  public async sendVoteNotification(
    post: any,
    user: any,
    type: vote
  ): Promise<boolean> {
    const content = util.format(
      constants.notificationContents.vote,
      user.username,
      constants.voteKeys[type],
      post.question.title
    );

    const notificationData: any = {
      title: constants.notifications.vote,
      content,
      receiverId: post.user.id
    };

    await SubscriptionNotification.add('vote', notificationData);

    return true;
  }

  public async sendCommentNotification(
    question: any,
    user: any
  ): Promise<boolean> {
    const content = util.format(
      constants.notificationContents.comment,
      user.username,
      question.title
    );

    const notificationData: any = {
      title: constants.notifications.comment,
      content,
      questionId: question._id,
      userId: user.id
    };

    await SubscriptionNotification.add('comment', notificationData);

    return true;
  }

  public async sendBestAnswerNotification(
    post: any,
    user: any
  ): Promise<boolean> {
    const content = util.format(
      constants.notificationContents.bestAnswer,
      user.username,
      post.question.title
    );

    const notificationData: any = {
      title: constants.notifications.bestAnswer,
      content,
      questionId: post.question._id,
      userId: user.id
    };

    await SubscriptionNotification.add('bestAnswer', notificationData);

    return true;
  }
}
