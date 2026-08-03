import AppError from './AppError.js'

/**
 * Thrown when a request conflicts with the current state of the server
 * (e.g., duplicate username/email, already enrolled, etc.)
 */
class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409, 'ConflictError')
  }
}

export default ConflictError