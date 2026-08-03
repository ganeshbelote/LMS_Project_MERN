/**
 * Base application error class.
 * All custom errors extend this class so the global error handler
 * can identify them via `instanceof AppError`.
 */
class AppError extends Error {
  constructor(message, statusCode = 500, type = 'AppError', details = undefined) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    this.type = type
    this.details = details
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}

export default AppError