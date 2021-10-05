import express from 'express';
import AuthController from '../api/controllers/auth.controller';
import validator from '../api/middlewares/validation-handler';
import asyncHandler from '../utils/async-handler';
import RegisterValidator from '../api/validators/auth/register-validator';
import LoginValidator from '../api/validators/auth/login-validator';

const route = express.Router();

route.post(
  '/auth/register',
  validator(RegisterValidator),
  asyncHandler(AuthController.register.bind(AuthController))
);

route.post(
  '/auth/login',
  validator(LoginValidator),
  asyncHandler(AuthController.login.bind(AuthController))
);

export default route;
