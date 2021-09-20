import { Request, Response } from 'express';
import { okResponse, validationErrorResponse } from '../../utils/response';
import PostService from '../../services/post.service';
import { extractValidationMessage } from '../../utils/helpers';
import CreatePostValidator from '../validators/post/create-validator';
import VoteValidator from '../validators/vote-validator';
import UpdatePostValidator from '../validators/post/update-validator';
import VoteService from '../../services/vote.service';

class PostController {
  private postService: PostService;

  private voteService: VoteService;

  constructor() {
    this.postService = new PostService();
    this.voteService = new VoteService();
  }

  public async index(request: Request, response: Response) {
    const { questionId } = request.params;

    const post = await this.postService.findByQuestion(questionId);

    return okResponse(response, 'Posts retrieved successfully', post);
  }

  public async show(request: Request, response: Response) {
    const { postId } = request.params;

    const post = await this.postService.findOne(postId);

    return okResponse(response, 'Post retrieved successfully', post);
  }

  public async create(request: Request, response: Response) {
    const { user } = request;
    const { questionId } = request.params;

    const data = request.body;

    const { error } = CreatePostValidator.validate(data);

    if (error) {
      const message: string = extractValidationMessage(error);
      return validationErrorResponse(response, 'Validation error', {
        error: message
      });
    }

    const post = await this.postService.create(questionId, data, user);

    return okResponse(response, 'Post created successfully', post);
  }

  public async update(request: Request, response: Response) {
    const user = request.user;
    const { postId } = request.params;
    const data = request.body;

    const { error } = UpdatePostValidator.validate(data);

    if (error) {
      const message: string = extractValidationMessage(error);
      return validationErrorResponse(response, 'Validation error', {
        error: message
      });
    }

    const post = await this.postService.update(postId, data, user);

    return okResponse(response, 'Post updated successfully', post);
  }

  public async markAsBestAnswer(request: Request, response: Response) {
    const { user } = request;
    const { postId } = request.params;

    const post = await this.postService.markAsBestAnswer(postId, user);

    return okResponse(response, 'Best answer selected successfully', post);
  }

  public async delete(request: Request, response: Response) {
    const { user } = request;
    const { postId } = request.params;

    await this.postService.delete(postId, user);

    return okResponse(response, 'Post removed successfully');
  }

  public async vote(request: Request, response: Response) {
    const { user } = request;
    const { postId } = request.params;

    const data = request.body;

    const { error } = VoteValidator.validate(data);

    if (error) {
      const message: string = extractValidationMessage(error);
      return validationErrorResponse(response, 'Validation error', {
        error: message
      });
    }

    await this.voteService.vote(postId, user, data.vote);

    return okResponse(response, 'Voted successfully');
  }

  public async deleteVote(request: Request, response: Response) {
    const { user } = request;
    const { postId } = request.params;

    await this.voteService.delete(postId, user);

    return okResponse(response, 'Vote removed successfully');
  }
}

export default new PostController();
