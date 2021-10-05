import { container, injectable } from 'tsyringe';
import { Request, Response } from 'express';
import UserService from '../../services/user.service';
import { createdResponse, okResponse } from '../../utils/response';

@injectable()
class AuthController {
  constructor(private readonly userService: UserService) {}

  /**
   * Create an account.
   *
   * @param request
   * @param response
   *
   * @returns Promise<Response>
   */
  public async register(
    request: Request,
    response: Response
  ): Promise<Response> {
    const data = request.body;

    const userData = await this.userService.createUser(data);

    return createdResponse(response, 'Account created successfully', userData);
  }

  /**
   * Login into user account.
   *
   * @param request
   * @param response
   *
   * @returns Promise<Response>
   */
  public async login(request: Request, response: Response): Promise<Response> {
    const data = request.body;

    const userData = await this.userService.login(data);

    return okResponse(response, 'Login successful', userData);
  }
}

export default container.resolve(AuthController);
