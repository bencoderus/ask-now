import express from 'express';
import UserController from '../api/controllers/user.controller';
import asyncHandler from '../utils/asyncHandler';
import authUser from '../api/middlewares/auth.middleware';

const route = express.Router();

route.get('/user/profile', authUser, asyncHandler(UserController.profile));

route.get(
  '/user/notifications',
  authUser,
  asyncHandler(UserController.notification)
);

route.patch(
  '/user/notifications/:notificationId/read',
  authUser,
  asyncHandler(UserController.markNotificationAsRead)
);

export default route;
