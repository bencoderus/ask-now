/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Request, Response, NextFunction } from 'express';
import handleException from '../utils/handle-exception';
import { notFoundResponse } from '../utils/response';
import authRoute from './auth.route';
import userRoute from './user.route';
import questionRoute from './question.route';

const route = express.Router();

route.use(authRoute);
route.use(userRoute);
route.use(questionRoute);

route.use(
  (error: any, request: Request, response: Response, next: NextFunction) => {
    return handleException(error, request, response);
  }
);

route.use((req: Request, res: Response, next: NextFunction) => {
  return notFoundResponse(res, 'Resource was not found');
});

export default route;
