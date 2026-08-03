import { generateRequestId } from '../utils/logger.js'

/**
 * Attach a unique request ID to every incoming request.
 * If the client provides an `X-Request-Id` header, use that instead.
 */
export const requestIdMiddleware = (req, res, next) => {
  const providedId = req.headers['x-request-id']
  const id = providedId && !Array.isArray(providedId) && providedId.trim()
    ? providedId.trim()
    : generateRequestId()

  req.id = id
  res.setHeader('X-Request-Id', id)
  next()
}

export default requestIdMiddleware