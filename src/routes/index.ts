/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Request, Response, NextFunction } from 'express';
import handleException from '../utils/handleException';
import { notFoundResponse, okResponse } from '../utils/response';
import authRoutes from './auth.route';
import userRoutes from './user.route';
import questionRoutes from './question.route';
import postRoutes from './post.route';

const route = express.Router();

route.use(authRoutes);
route.use(userRoutes);
route.use(questionRoutes);
route.use(postRoutes);

route.use(
  (error: any, request: Request, response: Response, next: NextFunction) => {
    return handleException(error, request, response);
  }
);

route.get('/', (request: Request, response: Response) => {
  return okResponse(response, 'Ask now version 1.0.0');
});

route.use((req: Request, res: Response, next: NextFunction) => {
  return notFoundResponse(res, 'Resource was not found');
});

export default route;
