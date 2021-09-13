import { NextFunction, Request, Response } from 'express';
import AuthService from '../../utils/auth-token';
import { unauthorizedResponse } from '../../utils/response';

export default async (req: Request, res: Response, next: NextFunction) => {
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
