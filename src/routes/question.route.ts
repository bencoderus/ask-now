import express from 'express';
import asyncHandler from '../utils/asyncHandler';
import authUser from '../api/middlewares/auth-user.middleware';
import QuestionController from '../api/controllers/question.controller';
import SubscriptionController from '../api/controllers/subscription.controller';
import QuestionValidator from '../api/validators/questionValidator';
import validator from '../api/middlewares/validation.middleware';

const route = express.Router();

route.get('/questions', authUser, asyncHandler(QuestionController.index));

route.get(
  '/questions/:questionId',
  authUser,
  asyncHandler(QuestionController.show)
);

route.post(
  '/questions',
  [authUser, validator(QuestionValidator)],
  asyncHandler(QuestionController.create)
);

route.patch(
  '/questions/:questionId',
  [authUser, validator(QuestionValidator)],
  asyncHandler(QuestionController.update)
);

route.delete(
  '/questions/:questionId',
  authUser,
  asyncHandler(QuestionController.destroy)
);

route.post(
  '/questions/:questionId/subscribe',
  authUser,
  asyncHandler(SubscriptionController.subscribe)
);

route.post(
  '/questions/:questionId/unsubscribe',
  authUser,
  asyncHandler(SubscriptionController.unsubscribe)
);

export default route;
