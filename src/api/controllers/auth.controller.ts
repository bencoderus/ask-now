import { container } from 'tsyringe';
import { Request, Response } from 'express';
import UserService from '../../services/user.service';
import { createdResponse, okResponse } from '../../utils/response';
import constants from '../../utils/constants';

const userService = container.resolve(UserService);

/**
 * Login into an account.
 *
 * @param {Request}  request
 * @param {Response} response
 *
 * @returns {Promise<Response>}
 */
const login = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const data = request.body;

  const userData = await userService.login(data);

  return okResponse(response, constants.loginSuccess, userData);
};

/**
 * Create an account.
 *
 * @param {Request} request
 * @param {Response} response
 *
 * @returns {Promise<Response>}
 */
const register = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const data = request.body;

  const userData = await userService.createUser(data);

  return createdResponse(response, constants.accountCreated, userData);
};

export default { login, register };
