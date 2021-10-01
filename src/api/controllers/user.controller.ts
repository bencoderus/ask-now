import { container, injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { okResponse } from '../../utils/response';
import NotificationService from '../../services/notification.service';

@injectable()
class UserController {
  constructor(private readonly notificationService: NotificationService) {}

  /**
   * Get all the user data.
   *
   * @param request
   * @param response
   *
   * @returns Promise<Response>
   */
  public async profile(
    request: Request,
    response: Response
  ): Promise<Response> {
    const { user } = request;

    return okResponse(response, 'User details retrieved successfully', user);
  }

  /**
   * Get all the user notifications.
   *
   * @param request
   * @param response
   *
   * @returns Promise<Response>
   */
  public async notification(request: Request, response: Response) {
    const { user } = request;

    const notifications = await this.notificationService.findByUser(user.id);

    return okResponse(
      response,
      'Notifications retrieved successfully',
      notifications
    );
  }

  /**
   * Mark a notification as read.
   *
   * @param request
   * @param response
   *
   * @returns Promise<Response>
   */
  public async markNotificationAsRead(request: Request, response: Response) {
    const { user } = request;
    const { notificationId } = request.params;

    await this.notificationService.markAsRead(notificationId, user);

    return okResponse(response, 'Notification marked as read successfully');
  }
}

export default container.resolve(UserController);
