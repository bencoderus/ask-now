import { okResponse, validationErrorResponse } from '../../utils/response';
import { Request, Response } from 'express';
import QuestionService from '../../services/question.service';
import QuestionValidator from '../validators/question-validator';
import { extractValidationMessage } from '../../utils/helpers';

class QuestionController {
  private questionService: QuestionService;

  constructor() {
    this.questionService = new QuestionService();
  }

  public async index(request: Request, response: Response) {
    const questions = await this.questionService.findAll();

    return okResponse(response, 'Questions retrieved successfully', questions);
  }

  public async show(request: Request, response: Response) {
    const { questionId } = request.params;

    const question = await this.questionService.findById(questionId);

    return okResponse(response, 'Questions retrieved successfully', question);
  }

  public async create(request: Request, response: Response) {
    const data = request.body;

    const { error } = QuestionValidator.validate(data);

    if (error) {
      const message: string = extractValidationMessage(error);
      return validationErrorResponse(response, 'Validation error', {
        error: message
      });
    }

    const question = await this.questionService.create(data, request.user);

    return okResponse(response, 'Question created successfully', question);
  }

  public async update(request: Request, response: Response) {
    const { questionId } = request.params;
    const data = request.body;
    const { user } = request;

    const { error } = QuestionValidator.validate(request.body);

    if (error) {
      const message: string = extractValidationMessage(error);
      return validationErrorResponse(response, 'Validation error', {
        error: message
      });
    }

    const question = await this.questionService.update(questionId, data, user);

    return okResponse(response, 'Question updated successfully', question);
  }

  public async delete(request: Request, response: Response) {
    const { questionId } = request.params;

    const question = await this.questionService.delete(questionId, request);

    return okResponse(response, 'Question deleted successfully', question);
  }
}

export default new QuestionController();
