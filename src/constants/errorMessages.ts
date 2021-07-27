export enum ErrorsMessages {
  MISSING_PARAMS = 'Missing params on body',
  INVALID_CREDENTIALS = 'Invalid credentials',
  EMAIL_NOT_SENT = 'Error at sending email',
  REDIS_ERROR = 'Error in redis database',
  REDIS_ERROR_SET_TOKEN = "Error setting user's token in blacklist",
  UNKNOWN = 'Unknown error',
  BODY_ERRORS = "You have errors in your request's body." +
    "Check 'errors' field for more details.",

  // HTTP STANDARD MESSAGES
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
  BAD_REQUEST_ERROR = 'Bad request error',
  TO_MANY_REQUESTS_ERROR = 'Too many requests',

  // ClassValidatorErrors
  PASSWORD_ERROR = 'Property password must be longer than or equal to 6 characters',
  GENDER_ERROR = 'Property gender must be a valid enum value',
  EMAIL_ERROR = 'Property email must be an email',
  LASTNAME_ERROR = 'Property lastName must be a string',
  FIRSTNAME_ERROR = 'Property firstName must be a string',

  // JWT Errors
  JWT_VALIDATION_ERROR = 'Error verifying JWT',
  JWT_DECODE_ERROR = 'Error decoding JWT',
  JWT_CREATE_ERROR = 'Error creating JWT'
}
