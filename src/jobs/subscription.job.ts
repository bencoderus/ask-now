import Bull from 'bull';
import NotificationService from '../services/notification.service';
import SubscriptionService from '../services/subscription.service';
import logger from '../utils/logger';

const SubscriptionNotification = new Bull('subscription-notification');

// Process vote notification job.
SubscriptionNotification.process('vote', async (job) => {
  const { receiverId, content, title } = job.data;

  const notificationService = new NotificationService();
  await notificationService.notifyReceiver(receiverId, title, content);

  logger.info(`Vote notification sent`);
});

// Process comment notification job.
SubscriptionNotification.process('comment', async (job) => {
  const { questionId, userId, content, title } = job.data;

  const subscriptionService = new SubscriptionService();
  const subscribers: any[] = await subscriptionService.getAllReceivers(
    questionId,
    userId
  );

  const notifySubscribers = async (subscribers: any) => {
    for (const subscriber of subscribers) {
      const notificationService = new NotificationService();
      await notificationService.notifyReceiver(subscriber.user, title, content);
      logger.info(`Notification sent to ${subscriber.user.toString()}`);
    }
  };

  await notifySubscribers(subscribers);

  logger.info('Answer notifications sent to subscribers.');
});

// Process best answer notification job.
SubscriptionNotification.process('bestAnswer', async (job) => {
  const { questionId, userId, content, title } = job.data;

  const subscriptionService = new SubscriptionService();
  const subscribers: any[] = await subscriptionService.getAllReceivers(
    questionId
  );

  const notifySubscribers = async (subscribers: any) => {
    for (const subscriber of subscribers) {
      const notificationService = new NotificationService();
      await notificationService.notifyReceiver(subscriber.user, title, content);
      logger.info(`Notification sent to ${subscriber.user.toString()}`);
    }
  };

  await notifySubscribers(subscribers);

  logger.info('Best answer notifications sent to subscribers.');
});

// Log job processing errors
SubscriptionNotification.on('error', console.error);

export default SubscriptionNotification;
