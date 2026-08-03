import pino from 'pino'
import { randomUUID } from 'crypto'

const isDev = process.env.NODE_ENV !== 'production'

// Pino logger with pretty-printing in development
const logger = pino({
  level: process.env.LOG_LEVEL || (isDev ? 'debug' : 'info'),
  base: {
    service: 'lms-backend'
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname,service',
          singleLine: false
        }
      }
    : undefined
})

/**
 * Generate a unique request ID (UUID v4).
 */
export const generateRequestId = () => randomUUID()

/**
 * Extract a readable file:line from an error stack trace.
 */
export const getErrorLocation = (err) => {
  if (!err?.stack) return null
  const lines = err.stack.split('\n')
  // Skip the first line (error message) and find the first app frame
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    // Match patterns like: at file:///path/file.js:12:34 or at /path/file.js:12:34
    const match = line.match(/at\s+(?:.*?\()?(.+?):(\d+):(\d+)\)?$/)
    if (match) {
      return {
        file: match[1].split('/').pop(),
        line: Number(match[2]),
        column: Number(match[3])
      }
    }
  }
  return null
}

export default logger