/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express';

const sendResponse = (
  response: Response,
  statusCode: number,
  message: string,
  data: any
): Response => {
  const status = statusCode >= 200 && statusCode <= 205;

  const responseData = !data ? { status, message } : { status, message, data };

  return response.status(statusCode).json(responseData);
};

export default sendResponse;
