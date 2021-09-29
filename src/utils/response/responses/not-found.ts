/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express';
import sendResponse from '../respond';

const statusCode = 404;

const respond = (response: Response, message: string, data?: any): Response => {
  return sendResponse(response, statusCode, message, data);
};

export default respond;
