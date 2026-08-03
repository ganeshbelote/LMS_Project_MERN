import AppError from './AppError.js'

/**
 * Thrown when a database operation fails (connection, query, etc.)
 */
class DatabaseError extends AppError {
  constructor(message = 'Database operation failed', details = undefined) {
    super(message, 500, 'DatabaseError', details)
  }
}

export default DatabaseError