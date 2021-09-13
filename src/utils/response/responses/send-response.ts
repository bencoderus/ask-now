import { Response } from 'express';
import sendResponse from '../respond';

const respond = (
  response: Response,
  statusCode: number,
  message: string,
  data: any = null
): Response => {
  return sendResponse(response, statusCode, message, data);
};

export default respond;
