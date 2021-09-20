import { Response, Request } from 'express';
import config from '../config';
import logger from './logger';
import sendResponse from './response/respond';

/**
 * Check if the statusCode is a server error.
 *
 * @param statusCode
 *
 * @returns boolean
 */
const isAnException = (statusCode: number): boolean => {
  return statusCode >= 500;
};

/**
 * Check if current environment is on production.
 *
 * @returns boolean
 */
const isProduction = (): boolean => {
  return config.environment === 'production';
};

/**
 * Handle the exception and return the appropriate status code where necessary.
 */
export default (error: any, request: Request, response: Response): Response => {
  const statusCode = error.statusCode || 500;

  const message = isAnException(statusCode)
    ? 'An error occurred'
    : error.message;

  const exception =
    isAnException(statusCode) && !isProduction()
      ? { exception: error.stack }
      : null;

  if (isAnException(statusCode)) logger.error(error);

  return sendResponse(response, statusCode, message, exception);
};
