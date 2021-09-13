import express from 'express';
import asyncHandler from '../utils/async-handler';
import authUser from '../api/middlewares/auth-user.middleware';
import QuestionController from '../api/controllers/question.controller';

const route = express.Router();

route.get(
  '/questions',
  authUser,
  asyncHandler(QuestionController.index.bind(QuestionController))
);

route.get(
  '/questions/:questionId',
  authUser,
  asyncHandler(QuestionController.show.bind(QuestionController))
);

route.patch(
  '/questions/:questionId',
  authUser,
  asyncHandler(QuestionController.update.bind(QuestionController))
);

route.post(
  '/questions',
  authUser,
  asyncHandler(QuestionController.create.bind(QuestionController))
);

export default route;
