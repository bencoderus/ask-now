import { container } from 'tsyringe';
import { Request, Response } from 'express';
import { okResponse } from '../../utils/response';
import QuestionService from '../../services/question.service';

const questionService = container.resolve(QuestionService);

/**
 * Get all questions.
 *
 * @param {Request}  request
 * @param {Response} response
 *
 * @returns {Promise<Response>}
 */
const index = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { query } = request;

  const questions = await questionService.findAll(query);

  return okResponse(response, 'Questions retrieved successfully', questions);
};

/**
 * Show a question.
 *
 * @param {Request}  request
 * @param {Response} response
 *
 * @returns {Promise<Response>}
 */
const show = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { questionId } = request.params;

  const question = await questionService.findById(questionId);

  return okResponse(response, 'Questions retrieved successfully', question);
};

/**
 * Create a question.
 *
 * @param {Request}  request
 * @param {Response} response
 *
 * @returns {Promise<Response>}
 */
const create = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { body, user } = request;

  const question = await questionService.create(body, user);

  return okResponse(response, 'Question created successfully', question);
};

/**
 * Update a question.
 *
 * @param {Request}  request
 * @param {Response} response
 *
 * @returns {Promise<Response>}
 */
const update = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { questionId } = request.params;
  const { body, user } = request;

  const question = await questionService.update(questionId, body, user);

  return okResponse(response, 'Question updated successfully', question);
};

/**
 * Delete a question.
 *
 * @param {Request}  request
 * @param {Response} response
 *
 * @returns {Promise<Response>}
 */
const destroy = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { questionId } = request.params;
  const { user } = request;

  await questionService.delete(questionId, user);

  return okResponse(response, 'Question deleted successfully');
};

export default {
  index,
  show,
  create,
  update,
  destroy
};
