import Bull from 'bull';
import NotificationService from '../services/notification.service';
import logger from '../utils/logger';

const SubscriptionNotification = new Bull('subscription-notification');

// Process vote notification job.
SubscriptionNotification.process('vote', async (job) => {
  const { receiverId, content, title } = job.data;
  const notificationService = new NotificationService();
  await notificationService.notifyReceiver(receiverId, title, content);

  logger.info(`Notification sent to ${receiverId}`);
});

// Log job processing errors
SubscriptionNotification.on('error', logger.error);

export default SubscriptionNotification;
