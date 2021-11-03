import { container } from 'tsyringe';
import { Request, Response } from 'express';
import { okResponse } from '../../utils/response';
import PostService from '../../services/post.service';
import VoteService from '../../services/vote.service';

const postService = container.resolve(PostService);

/**
 * Get posts for a question.
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
  const { questionId } = request.params;

  const post = await postService.findByQuestion(questionId);

  return okResponse(response, 'Posts retrieved successfully', post);
};

/**
 * Get a post.
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
  const { postId } = request.params;

  const post = await postService.findOne(postId);

  return okResponse(response, 'Post retrieved successfully', post);
};

/**
 * Create a new post.
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
  const { user } = request;
  const { questionId } = request.params;
  const data = request.body;

  const post = await postService.create(questionId, data, user);

  return okResponse(response, 'Post created successfully', post);
};

/**
 * Update a post.
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
  const { user } = request;
  const { postId } = request.params;
  const data = request.body;

  const post = await postService.update(postId, data, user);

  return okResponse(response, 'Post updated successfully', post);
};

/**
 * Mark as best answer.
 *
 * @param {Request}  request
 * @param {Response} response
 *
 * @returns {Promise<Response>}
 */
const markAsBestAnswer = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { user } = request;
  const { postId } = request.params;

  const post = await postService.markAsBestAnswer(postId, user);

  return okResponse(response, 'Best answer selected successfully', post);
};

/**
 * Remove a post.
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
  const { user } = request;
  const { postId } = request.params;

  await postService.delete(postId, user);

  return okResponse(response, 'Post removed successfully');
};

/**
 * Vote for a post (upvote or downvote).
 *
 * @param {Request}  request
 * @param {Response} response
 *
 * @returns {Promise<Response>}
 */
const vote = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { user } = request;
  const { postId } = request.params;
  const { vote } = request.body;

  const voteService = container.resolve(VoteService);
  const post = await voteService.vote(postId, user, vote);

  return okResponse(response, 'Vote registered successfully', post);
};

/**
 * Remove vote for a post.
 *
 * @param {Request}  request
 * @param {Response} response
 *
 * @returns {Promise<Response>}
 */
const removeVote = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { user } = request;
  const { postId } = request.params;

  const voteService = container.resolve(VoteService);
  await voteService.delete(postId, user);

  return okResponse(response, 'Vote removed successfully');
};

export default {
  index,
  show,
  create,
  update,
  markAsBestAnswer,
  destroy,
  vote,
  removeVote
};
