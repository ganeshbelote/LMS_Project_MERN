import AppError from './AppError.js'

/**
 * Thrown when an authenticated user lacks permission to access a resource.
 */
class ForbiddenError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403, 'ForbiddenError')
  }
}

export default ForbiddenError