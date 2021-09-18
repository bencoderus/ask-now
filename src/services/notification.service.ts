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

  public async sendVoteNotification(notificationData: {
    receiverId: string;
    content: string;
    title?: string;
  }): Promise<boolean> {
    notificationData.title = constants.notifications.vote;

    const job = await SubscriptionNotification.add('vote', notificationData);

    return true;
  }
}
