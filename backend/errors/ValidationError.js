import AppError from './AppError.js'

/**
 * Thrown when request data fails validation (missing fields, invalid format, etc.)
 */
class ValidationError extends AppError {
  constructor(message = 'Validation failed', details = undefined) {
    super(message, 400, 'ValidationError', details)
  }
}

export default ValidationError