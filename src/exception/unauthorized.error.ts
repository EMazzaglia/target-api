import { BaseError } from './base.error';
import { HttpStatusCode } from '../constants/httpStatusCode';

export class UnAuthorizedError extends BaseError {
  constructor(name, description) {
    super(name, HttpStatusCode.UNAUTHORIZED, description);
  }
}
