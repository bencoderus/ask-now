import { container } from 'tsyringe';
import { Request, Response } from 'express';
import { okResponse } from '../../utils/response';
import SubscriptionService from '../../services/subscription.service';

const subscriptionService = container.resolve(SubscriptionService);

/**
 * Subscribe to a question.
 *
 * @param {Request} request
 * @param {Response} response
 *
 * @returns {Promise<Response>}
 */
const subscribe = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { user } = request;
  const { questionId } = request.params;

  const question = await subscriptionService.subscribe(questionId, user);

  return okResponse(response, 'Subscription added successfully', question);
};

/**
 * Unsubscribe from a question.
 *
 * @param {Request} request
 * @param {Response} response
 *
 * @returns {Promise<Response>}
 */
const unsubscribe = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { user } = request;
  const { questionId } = request.params;

  const question = await subscriptionService.unsubscribe(questionId, user);

  return okResponse(response, 'Subscription removed successfully', question);
};

export default { subscribe, unsubscribe };
