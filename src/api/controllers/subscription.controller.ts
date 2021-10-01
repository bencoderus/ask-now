import { container, injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { okResponse } from '../../utils/response';
import SubscriptionService from '../../services/subscription.service';

@injectable()
class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  /**
   * Subscribe to a question.
   *
   * @param request
   * @param response
   *
   * @returns Promise<Response>
   */
  public async subscribe(request: Request, response: Response) {
    const { user } = request;
    const { questionId } = request.params;

    const question = await this.subscriptionService.subscribe(questionId, user);

    return okResponse(response, 'Subscription added successfully', question);
  }

  /**
   * Unsubscribe from a question.
   *
   * @param request
   * @param response
   *
   * @returns Promise<Response>
   */
  public async unsubscribe(request: Request, response: Response) {
    const { user } = request;
    const { questionId } = request.params;

    const question = await this.subscriptionService.unsubscribe(
      questionId,
      user
    );

    return okResponse(response, 'Subscription removed successfully', question);
  }
}

export default container.resolve(SubscriptionController);
