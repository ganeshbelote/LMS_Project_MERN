import mongoose from 'mongoose'
import multer from 'multer'
import logger, { getErrorLocation } from '../utils/logger.js'
import { failure } from '../utils/response.js'
import { AppError } from '../errors/index.js'

const isDev = process.env.NODE_ENV !== 'production'

// Extract a clean, human-readable message from Zod validation issues
const formatZodError = (err) => {
  if (!err.issues || !Array.isArray(err.issues)) return undefined
  return err.issues.map(issue => ({
    path: issue.path.join('.'),
    message: issue.message
  }))
}

// Map any thrown error to a normalized error descriptor
const normalizeError = (err) => {
  // 1. Our own AppError subclasses
  if (err instanceof AppError) {
    return {
      statusCode: err.statusCode,
      type: err.type || err.name,
      message: err.message,
      details: err.details,
      operational: err.isOperational !== false
    }
  }

  // 2. Zod validation errors
  if (err?.name === 'ZodError') {
    return {
      statusCode: 400,
      type: 'ValidationError',
      message: 'Validation failed',
      details: formatZodError(err),
      operational: true
    }
  }

  // 3. Multer file upload errors
  if (err instanceof multer.MulterError) {
    const messageMap = {
      LIMIT_FILE_SIZE: 'File too large. Please upload a smaller file.',
      LIMIT_FILE_COUNT: 'Too many files uploaded.',
      LIMIT_UNEXPECTED_FILE: 'Unexpected file field name.',
      LIMIT_PART_COUNT: 'Too many parts in the upload.',
      LIMIT_FIELD_KEY: 'Field name too long.',
      LIMIT_FIELD_VALUE: 'Field value too long.',
      LIMIT_FIELD_COUNT: 'Too many fields in the form.'
    }
    return {
      statusCode: 400,
      type: 'FileUploadError',
      message: messageMap[err.code] || err.message || 'File upload failed',
      details: { code: err.code, field: err.field },
      operational: true
    }
  }

  // 4. Mongoose validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    const details = Object.entries(err.errors).map(([path, e]) => ({
      path,
      message: e.message
    }))
    return {
      statusCode: 400,
      type: 'ValidationError',
      message: 'Validation failed',
      details,
      operational: true
    }
  }

  // 5. MongoDB duplicate key errors (E11000)
  if (err?.code === 11000) {
    const key = Object.keys(err?.keyPattern || {})[0] || 'field'
    return {
      statusCode: 409,
      type: 'DuplicateKeyError',
      message: `${key} already exists. Please use a different value.`,
      details: err.keyValue,
      operational: true
    }
  }

  // 6. Mongoose CastError (invalid ObjectId, bad number, etc.)
  if (err instanceof mongoose.Error.CastError) {
    return {
      statusCode: 400,
      type: 'CastError',
      message: `Invalid value for "${err.path}": ${err.value}. Expected a valid ${err.kind}.`,
      details: { path: err.path, value: err.value, kind: err.kind },
      operational: true
    }
  }

  // 7. JSON parse errors from express.json()
  if (err instanceof SyntaxError && 'body' in err) {
    return {
      statusCode: 400,
      type: 'JsonParseError',
      message: 'Invalid JSON payload',
      operational: true
    }
  }

  // 8. Unknown / internal errors
  return {
    statusCode: 500,
    type: 'InternalServerError',
    message: 'Internal Server Error',
    operational: false
  }
}

/**
 * Centralized error handler.
 * All errors (from asyncHandler, next(err), sync throws) flow through here.
 */
export const errorHandler = (err, req, res, _next) => {
  const { statusCode, type, message, details, operational } = normalizeError(err)
  const requestId = req.id || res.getHeader('X-Request-Id')
  const location = getErrorLocation(err)

  // --- Logging ----------------------------------------------------------
  const logBase = {
    requestId,
    method: req.method,
    url: req.originalUrl || req.url,
    statusCode,
    errorType: type,
    errorMessage: err.message || message,
    ...(location && { file: location.file, line: location.line, column: location.column })
  }

  if (statusCode >= 500) {
    logger.error({ ...logBase, stack: err.stack }, 'Unhandled error')
  } else if (statusCode >= 400) {
    logger.warn({ ...logBase }, 'Request error')
  }

  // --- Response ---------------------------------------------------------
  // Never expose stack traces in production.
  const stack = isDev && statusCode >= 500 ? err.stack : undefined

  const errorBody = {
    statusCode,
    type,
    message: isDev || operational ? message : 'Internal Server Error',
    ...(requestId && { requestId }),
    ...(details !== undefined && { details }),
    ...(stack !== undefined && { stack })
  }

  return failure(res, errorBody)
}

/**
 * 404 handler for unknown routes.
 */
export const notFoundHandler = (req, res) => {
  return failure(res, {
    statusCode: 404,
    type: 'NotFoundError',
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    requestId: req.id || res.getHeader('X-Request-Id')
  })
}