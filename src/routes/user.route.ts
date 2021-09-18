import express from 'express';
import UserController from '../api/controllers/user.controller';
import asyncHandler from '../utils/async-handler';
import authUser from '../api/middlewares/auth-user.middleware';

const route = express.Router();

route.get(
  '/user/profile',
  authUser,
  asyncHandler(UserController.profile.bind(UserController))
);

route.get(
  '/user/notifications',
  authUser,
  asyncHandler(UserController.notification.bind(UserController))
);

export default route;
