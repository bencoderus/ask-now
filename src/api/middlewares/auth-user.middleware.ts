/* eslint-disable consistent-return */
import { NextFunction, Request, Response } from 'express';
import AuthService from '../../utils/authToken';
import { unauthorizedResponse } from '../../utils/response';

/**
 * Verify user token and return user data.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 *
 * @returns {void | Response}
 */
export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(' ')[1];

  if (!token) {
    return unauthorizedResponse(res, 'Authorization token is not set');
  }

  const { verified, decoded } = await AuthService.verifyToken(token);

  if (!verified) {
    return unauthorizedResponse(res, 'Unauthorized token');
  }

  req.user = decoded.payload;

  next();
};
