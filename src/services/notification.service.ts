import { injectable } from 'tsyringe';
import util from 'util';
import { isValidObjectId, LeanDocument } from 'mongoose';
import HttpException from '../exceptions/http.exception';
import SubscriptionNotification from '../jobs/subscription.job';
import Notification from '../models/notification.model';
import constants from '../utils/constants';
import { vote } from '../types/custom';
import { UserInterface } from '../interfaces/models/user.interface';
import { NotificationInterface } from '../interfaces/models/notification.interface';
import { QuestionInterface } from '../interfaces/models/question.interface';
import { PostInterface } from '../interfaces/models/post.interface';

@injectable()
export default class NotificationService {
  public async findByUser(
    userId: string
  ): Promise<LeanDocument<NotificationInterface[]>> {
    const notifications: LeanDocument<NotificationInterface[]> =
      await Notification.find({ user: userId })
        .sort('-createdAt')
        .limit(40)
        .lean();

    return notifications;
  }

  public async findOne(id: string, userId: string) {
    if (!isValidObjectId(id)) {
      throw new HttpException(constants.notificationNotFound, 404);
    }

    const notification: NotificationInterface | null =
      await Notification.findOne({ _id: id, user: userId });

    if (!notification) {
      throw new HttpException(constants.notificationNotFound, 404);
    }

    return notification;
  }

  public async markAsRead(
    notificationId: string,
    user: UserInterface
  ): Promise<NotificationInterface> {
    const notification = await this.findOne(notificationId, user.id);

    await Notification.updateOne(
      {
        _id: notificationId
      },
      {
        $set: { read: true }
      }
    );

    return notification;
  }

  public async notifyReceiver(
    receiverId: string,
    title: string,
    content: string
  ): Promise<NotificationInterface> {
    const notification: NotificationInterface = await Notification.create({
      title,
      content,
      user: receiverId
    });

    return notification;
  }

  public async sendVoteNotification(
    post: PostInterface,
    user: UserInterface,
    type: vote
  ): Promise<boolean> {
    const content = util.format(
      constants.notificationContents.vote,
      user.username,
      constants.voteKeys[type],
      post.question.title
    );

    const notificationData: Record<string, string> = {
      title: constants.notifications.vote,
      content,
      receiverId: post.user.id
    };

    await SubscriptionNotification.add('vote', notificationData);

    return true;
  }

  public async sendCommentNotification(
    question: QuestionInterface,
    user: UserInterface
  ): Promise<boolean> {
    const content = util.format(
      constants.notificationContents.comment,
      user.username,
      question.title
    );

    const notificationData: Record<string, string> = {
      title: constants.notifications.comment,
      content,
      questionId: question._id,
      userId: user.id
    };

    await SubscriptionNotification.add('comment', notificationData);

    return true;
  }

  public async sendBestAnswerNotification(
    post: PostInterface,
    user: UserInterface
  ): Promise<boolean> {
    const content = util.format(
      constants.notificationContents.bestAnswer,
      user.username,
      post.question.title
    );

    const notificationData: Record<string, string> = {
      title: constants.notifications.bestAnswer,
      content,
      questionId: post.question._id,
      userId: user.id
    };

    await SubscriptionNotification.add('bestAnswer', notificationData);

    return true;
  }
}
