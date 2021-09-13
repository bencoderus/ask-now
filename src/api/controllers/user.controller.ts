import { okResponse } from '../../utils/response';
import { Request, Response } from 'express';

class UserController {
  public async profile(request: Request, response: Response) {
    const user = request.user;

    return okResponse(response, 'User details retrieved successfully', user);
  }
}

export default new UserController();
