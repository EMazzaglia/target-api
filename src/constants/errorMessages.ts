export enum Errors {
  MISSING_PARAMS = 'Missing params on body',
  INVALID_CREDENTIALS = 'Invalid credentials',
  UNKNOWN = 'Unknown error',
  EMAIL_NOT_SENT = 'Error at sending email',
  PASSWORD_ERROR = 'Password is too short, the minimum length is 6 characters.',
  BODY_ERRORS = "You have errors in your request's body." +
    "Check 'errors' field for more details.",

  // HTTP STANDARD MESSAGES
  INTERNAL_SERVER_ERROR = 'Internal server error',
  BAD_REQUEST_ERROR = 'Bad request error'
}
