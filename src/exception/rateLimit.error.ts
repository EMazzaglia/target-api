import { ErrorsMessages } from '@constants/errorMessages';
import { BaseError } from './base.error';
import { HttpStatusCode } from '../constants/httpStatusCode';

export class RateLimitError extends BaseError {
  constructor(description) {
    super(
      ErrorsMessages.TO_MANY_REQUESTS_ERROR,
      HttpStatusCode.TO_MANY_REQUESTS,
      description
    );
  }
}
