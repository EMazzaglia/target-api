import { Errors } from '@constants/errorMessages';
import { BaseError } from './baseError';
import { HttpStatusCode } from '../../constants/httpStatusCode';

export class DatabaseError extends BaseError {
  constructor(description) {
    super(Errors.INTERNAL_SERVER_ERROR, HttpStatusCode.INTERNAL_SERVER, description);
  }
}
