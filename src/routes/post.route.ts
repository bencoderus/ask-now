import express from 'express';
import PostController from '../api/controllers/post.controller';
import asyncHandler from '../utils/async-handler';
import authUser from '../api/middlewares/auth-user.middleware';

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
  authUser,
  asyncHandler(PostController.create.bind(PostController))
);

route.patch(
  '/questions/posts/:postId',
  authUser,
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
  authUser,
  asyncHandler(PostController.vote.bind(PostController))
);

route.delete(
  '/questions/posts/:postId/vote',
  authUser,
  asyncHandler(PostController.deleteVote.bind(PostController))
);

export default route;
