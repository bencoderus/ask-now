import { okResponse } from '../../utils/response';
import { Request, Response } from 'express';
import NotificationService from '../../services/notification.service';
import { not } from 'joi';

class UserController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  public async profile(request: Request, response: Response) {
    const user = request.user;

    return okResponse(response, 'User details retrieved successfully', user);
  }

  public async notification(request: Request, response: Response) {
    const user = request.user;

    const notifications = await this.notificationService.findByUser(user.id);

    return okResponse(
      response,
      'Notifications retrieved successfully',
      notifications
    );
  }
}

export default new UserController();
