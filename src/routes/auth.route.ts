import express from 'express';
import AuthController from '../api/controllers/auth.controller';
import asyncHandler from '../utils/async-handler';

const route = express.Router();

route.post(
  '/auth/register',
  asyncHandler(AuthController.register.bind(AuthController))
);

route.post(
  '/auth/login',
  asyncHandler(AuthController.login.bind(AuthController))
);

export default route;
