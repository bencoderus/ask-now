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

  public async register(req: Request, res: Response): Promise<Response> {
    const data = req.body;

    const { error } = RegisterValidator.validate(data);

    if (error) {
      const message: string = extractValidationMessage(error);
      return validationErrorResponse(res, 'Validation error', {
        error: message
      });
    }

    const userData = await this.userService.createUser(data);

    return createdResponse(res, 'Account created successfully', userData);
  }

  public async login(req: Request, res: Response): Promise<Response> {
    const data = req.body;

    const { error } = LoginValidator.validate(data);

    if (error) {
      const message: string = extractValidationMessage(error);
      return validationErrorResponse(res, 'Validation error', {
        error: message
      });
    }

    const userData = await this.userService.login(data);

    return okResponse(res, 'Login successful', userData);
  }
}

export default new AuthController();
