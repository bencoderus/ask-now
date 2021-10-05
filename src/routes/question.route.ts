import express from 'express';
import asyncHandler from '../utils/async-handler';
import authUser from '../api/middlewares/auth-user.middleware';
import QuestionController from '../api/controllers/question.controller';
import SubscriptionController from '../api/controllers/subscription.controller';
import QuestionValidator from '../api/validators/question-validator';
import validator from '../api/middlewares/validation-handler';

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

route.post(
  '/questions',
  [authUser, validator(QuestionValidator)],
  asyncHandler(QuestionController.create.bind(QuestionController))
);

route.patch(
  '/questions/:questionId',
  [authUser, validator(QuestionValidator)],
  asyncHandler(QuestionController.update.bind(QuestionController))
);

route.delete(
  '/questions/:questionId',
  authUser,
  asyncHandler(QuestionController.delete.bind(QuestionController))
);

route.post(
  '/questions/:questionId/subscribe',
  authUser,
  asyncHandler(SubscriptionController.subscribe.bind(SubscriptionController))
);

route.post(
  '/questions/:questionId/unsubscribe',
  authUser,
  asyncHandler(SubscriptionController.unsubscribe.bind(SubscriptionController))
);

export default route;
