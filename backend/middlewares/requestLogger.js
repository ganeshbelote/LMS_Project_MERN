import logger from '../utils/logger.js'

/**
 * Structured request logging with response time.
 * Logs method, URL, status code, response time, IP, and request ID.
 */
export const requestLogger = (req, res, next) => {
  const start = process.hrtime.bigint()

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6
    const logData = {
      requestId: req.id || res.getHeader('X-Request-Id'),
      method: req.method,
      url: req.originalUrl || req.url,
      statusCode: res.statusCode,
      responseTime: `${durationMs.toFixed(2)}ms`,
      ip: req.ip || req.socket?.remoteAddress || null
    }

    if (res.statusCode >= 500) {
      logger.error(logData, 'Request completed with server error')
    } else if (res.statusCode >= 400) {
      logger.warn(logData, 'Request completed with client error')
    } else {
      logger.info(logData, 'Request completed')
    }
  })

  next()
}

export default requestLogger