/* eslint-disable consistent-return */
import { NextFunction, Response, Request } from 'express';
import { ObjectSchema } from 'joi';
import { extractValidationMessage } from '../../utils/string.util';
import { validationErrorResponse } from '../../utils/response';

/**
 * Handle all validation errors
 *
 * @param schema
 * @returns void | Response
 */
const validator =
  (schema: ObjectSchema) =>
  (
    request: Request,
    response: Response,
    next: NextFunction
  ): void | Response => {
    const { error } = schema.validate(request.body);

    if (error) {
      const message: string = extractValidationMessage(error);
      return validationErrorResponse(response, 'Validation error', {
        error: message
      });
    }

    next();
  };

export default validator;
