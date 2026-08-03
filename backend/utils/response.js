/**
 * Standardized success response.
 *
 * { success: true, ok: true, message, data, ...meta }
 *
 * `ok` is kept as a legacy alias so existing frontend code checking
 * `res.data.ok` continues to work during migration.
 */
export const success = (res, { statusCode = 200, message = 'Success', data = undefined, meta = undefined }) => {
  const body = { success: true, ok: true, message }
  if (data !== undefined) body.data = data
  if (meta !== undefined) body.meta = meta
  return res.status(statusCode).json(body)
}

/**
 * Standardized failure response.
 *
 * { success: false, ok: false, message, error: { type, message, statusCode, requestId, ...details } }
 *
 * `ok` and top-level `message` are kept as legacy aliases so existing
 * frontend error toasts keep working during migration.
 */
export const failure = (res, { statusCode = 500, type = 'InternalServerError', message = 'Internal Server Error', requestId = null, details = undefined, stack = undefined }) => {
  const error = {
    type,
    message,
    statusCode,
    ...(requestId && { requestId }),
    ...(details !== undefined && { details }),
    ...(stack !== undefined && { stack })
  }
  return res.status(statusCode).json({ success: false, ok: false, message, error })
}
