import { container, injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { okResponse } from '../../utils/response';
import QuestionService from '../../services/question.service';

@injectable()
class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  public async index(request: Request, response: Response): Promise<Response> {
    const { query } = request;
    const questions = await this.questionService.findAll(query);

    return okResponse(response, 'Questions retrieved successfully', questions);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { questionId } = request.params;

    const question = await this.questionService.findById(questionId);

    return okResponse(response, 'Questions retrieved successfully', question);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const data = request.body;

    const question = await this.questionService.create(data, request.user);

    return okResponse(response, 'Question created successfully', question);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { questionId } = request.params;
    const data = request.body;
    const { user } = request;

    const question = await this.questionService.update(questionId, data, user);

    return okResponse(response, 'Question updated successfully', question);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { questionId } = request.params;
    const { user } = request;

    await this.questionService.delete(questionId, user);

    return okResponse(response, 'Question deleted successfully');
  }
}

export default container.resolve(QuestionController);
