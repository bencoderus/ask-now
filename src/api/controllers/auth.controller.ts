import { Request, Response } from 'express';
import UserService from '../../services/user.service';
import { extractValidationMessage } from '../../utils/helpers';
import {
  createdResponse,
  okResponse,
  validationErrorResponse
} from '../../utils/response';
import RegisterValidator from '../validators/auth/register-validator';
import LoginValidator from '../validators/auth/login-validator';

class AuthController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

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

    const { error } = RegisterValidator.validate(data);

    if (error) {
      const message: string = extractValidationMessage(error);
      return validationErrorResponse(response, 'Validation error', {
        error: message
      });
    }

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

    const { error } = LoginValidator.validate(data);

    if (error) {
      const message: string = extractValidationMessage(error);
      return validationErrorResponse(response, 'Validation error', {
        error: message
      });
    }

    const userData = await this.userService.login(data);

    return okResponse(response, 'Login successful', userData);
  }
}

export default new AuthController();
