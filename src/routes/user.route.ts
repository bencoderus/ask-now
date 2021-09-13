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

export default route;
