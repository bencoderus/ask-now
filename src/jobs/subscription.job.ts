import Bull from 'bull';
import { LeanDocument } from 'mongoose';
import SubscriptionService from '../services/subscription.service';
import NotificationService from '../services/notification.service';
import logger from '../utils/logger.util';
import { SubscribersInterface } from '../interfaces/models/question.interface';
import config from '../config';

const SubscriptionNotification = new Bull('subscription-notification', {
  redis: config.redisUri
});

// Process vote notification job.
SubscriptionNotification.process('vote', async (job) => {
  const { receiverId, content, title } = job.data;

  const notificationService = new NotificationService();
  await notificationService.notifyReceiver(receiverId, title, content);
});

// Process comment notification job.
SubscriptionNotification.process('comment', async (job) => {
  const { questionId, userId, content, title } = job.data;

  const subscriptionService = new SubscriptionService();
  const subscribers: LeanDocument<SubscribersInterface[]> =
    await subscriptionService.getAllReceivers(questionId, userId);

  const promises = [];

  for (const subscriber of subscribers) {
    const notificationService = new NotificationService();
    promises.push(
      notificationService.notifyReceiver(subscriber.user, title, content)
    );
  }

  await Promise.all(promises);

  logger.info('Answer notifications sent to subscribers.');
});

// Process best answer notification job.
SubscriptionNotification.process('bestAnswer', async (job) => {
  const { questionId, content, title } = job.data;

  const subscriptionService = new SubscriptionService();
  const subscribers: LeanDocument<SubscribersInterface[]> =
    await subscriptionService.getAllReceivers(questionId);

  const promises = [];

  for (const subscriber of subscribers) {
    const notificationService = new NotificationService();
    promises.push(
      notificationService.notifyReceiver(subscriber.user, title, content)
    );
  }

  await Promise.all(promises);

  logger.info('Best answer notifications sent to subscribers.');
});

// Log all errors.
SubscriptionNotification.on('failed', (job, error) => {
  logger.info(`Unable to send ${job.data.title}`);
  logger.error(error);
});

// Log notification sent.
SubscriptionNotification.on('completed', (job) => {
  logger.info(`${job.data.title} was sent to all the subscribers.`);
});

export default SubscriptionNotification;
