import express from 'express';
import PostController from '../api/controllers/post.controller';
import asyncHandler from '../utils/asyncHandler';
import authUser from '../api/middlewares/auth.middleware';
import CreatePostValidator from '../api/validators/post/create-validator';
import UpdatePostValidator from '../api/validators/post/update-validator';
import VoteValidator from '../api/validators/voteValidator';
import validator from '../api/middlewares/validation.middleware';

const route = express.Router();

route.get(
  '/questions/:questionId/posts',
  authUser,
  asyncHandler(PostController.index)
);

route.get(
  '/questions/posts/:postId',
  authUser,
  asyncHandler(PostController.show)
);

route.post(
  '/questions/:questionId/posts',
  [authUser, validator(CreatePostValidator)],
  asyncHandler(PostController.create)
);

route.patch(
  '/questions/posts/:postId',
  [authUser, validator(UpdatePostValidator)],
  asyncHandler(PostController.update)
);

route.patch(
  '/questions/posts/:postId/best-answer',
  authUser,
  asyncHandler(PostController.markAsBestAnswer)
);

route.delete(
  '/questions/posts/:postId',
  authUser,
  asyncHandler(PostController.destroy)
);

route.post(
  '/questions/posts/:postId/vote',
  [authUser, validator(VoteValidator)],
  asyncHandler(PostController.addVote)
);

route.delete(
  '/questions/posts/:postId/vote',
  authUser,
  asyncHandler(PostController.removeVote)
);

export default route;
