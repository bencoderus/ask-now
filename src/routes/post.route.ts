import express from 'express';
import PostController from '../api/controllers/post.controller';
import asyncHandler from '../utils/async-handler';
import authUser from '../api/middlewares/auth-user.middleware';
import CreatePostValidator from '../api/validators/post/create-validator';
import UpdatePostValidator from '../api/validators/post/update-validator';
import VoteValidator from '../api/validators/vote-validator';
import validator from '../api/middlewares/validation-handler';

const route = express.Router();

route.get(
  '/questions/:questionId/posts',
  authUser,
  asyncHandler(PostController.index.bind(PostController))
);

route.get(
  '/questions/posts/:postId',
  authUser,
  asyncHandler(PostController.show.bind(PostController))
);

route.post(
  '/questions/:questionId/posts',
  [authUser, validator(CreatePostValidator)],
  asyncHandler(PostController.create.bind(PostController))
);

route.patch(
  '/questions/posts/:postId',
  [authUser, validator(UpdatePostValidator)],
  asyncHandler(PostController.update.bind(PostController))
);

route.patch(
  '/questions/posts/:postId/best-answer',
  authUser,
  asyncHandler(PostController.markAsBestAnswer.bind(PostController))
);

route.delete(
  '/questions/posts/:postId',
  authUser,
  asyncHandler(PostController.delete.bind(PostController))
);

route.post(
  '/questions/posts/:postId/vote',
  [authUser, validator(VoteValidator)],
  asyncHandler(PostController.vote.bind(PostController))
);

route.delete(
  '/questions/posts/:postId/vote',
  authUser,
  asyncHandler(PostController.deleteVote.bind(PostController))
);

export default route;
