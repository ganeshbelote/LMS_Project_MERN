import AppError from './AppError.js'

/**
 * Thrown when a requested resource does not exist.
 */
class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NotFoundError')
  }
}

export default NotFoundError