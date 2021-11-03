import { container } from 'tsyringe';
import { Request, Response } from 'express';
import { okResponse } from '../../utils/response';
import NotificationService from '../../services/notification.service';

const notificationService = container.resolve(NotificationService);

/**
 * Get the currently authenticated user.
 *
 * @param {Request}  request
 * @param {Response} response
 *
 * @returns {Promise<Response>}
 */
const profile = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { user } = request;

  return okResponse(response, 'User details retrieved successfully', user);
};

/**
 * Get all notifications.
 *
 * @param {Request}  request
 * @param {Response} response
 *
 * @returns {Promise<Response>}
 */
const notification = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { user } = request;

  const notifications = await notificationService.findByUser(user.id);

  return okResponse(
    response,
    'Notifications retrieved successfully',
    notifications
  );
};

/**
 * Mark notification as read.
 *
 * @param {Request}  request
 * @param {Response} response
 *
 * @returns {Promise<Response>}
 */
const markNotificationAsRead = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { user } = request;
  const { notificationId } = request.params;

  await notificationService.markAsRead(notificationId, user);

  return okResponse(response, 'Notification marked as read successfully');
};

export default {
  profile,
  notification,
  markNotificationAsRead
};
