/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express';
import sendResponse from '../respond';

const respond = (
  response: Response,
  statusCode: number,
  message: string,
  data?: any
): Response => {
  return sendResponse(response, statusCode, message, data);
};

export default respond;
