import express from 'express';
import AuthController from '../api/controllers/auth.controller';
import validator from '../api/middlewares/validation.middleware';
import asyncHandler from '../utils/asyncHandler';
import RegisterValidator from '../api/validators/auth/registerValidator';
import LoginValidator from '../api/validators/auth/loginValidator';

const route = express.Router();

route.post(
  '/auth/register',
  validator(RegisterValidator),
  asyncHandler(AuthController.register)
);

route.post(
  '/auth/login',
  validator(LoginValidator),
  asyncHandler(AuthController.login)
);

export default route;
