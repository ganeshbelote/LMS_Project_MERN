import AppError from './AppError.js'

/**
 * Thrown when a user is not authenticated (missing/invalid token).
 */
class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401, 'UnauthorizedError')
  }
}

export default UnauthorizedError