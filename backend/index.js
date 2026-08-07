import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import rateLimit from 'express-rate-limit'

import { connectDB } from './database/db.js'
import logger from './utils/logger.js'
import { validateEnv, env } from './utils/env.js'
import { requestIdMiddleware } from './middlewares/requestId.js'
import { requestLogger } from './middlewares/requestLogger.js'
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js'

import auth from './routes/auth.route.js'
import course from './routes/course.route.js'
import notification from './routes/notification.route.js'
import task from './routes/task.route.js'
import analytics from './routes/analytics.route.js'

dotenv.config()

// Fail fast if required env vars are missing
validateEnv()

const app = express()
app.use(express.json({ limit: '10mb' }))

// --- CORS ----------------------------------------------------------------
const allowedOrigins = (process.env.CORS_ORIGINS || env('CLIENT_URL', [], 'http://localhost:5173'))
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean)

app.use(cors({
  origin(origin, callback) {
    // Allow requests with no origin (curl, Postman, same-origin, health checks)
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    return callback(new Error(`CORS: Origin ${origin} not allowed`))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id']
}))

app.use(express.static('public'))

// --- Request ID + structured request logging ---------------------------
app.use(requestIdMiddleware)
app.use(requestLogger)

// --- Rate limiting -------------------------------------------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, slow down.',
  standardHeaders: true,
  legacyHeaders: false
})

app.use('/api/v1/auth', limiter, auth)
app.use('/api/v1/courses', limiter, course)
app.use('/api/v1/notifications', limiter, notification)
app.use('/api/v1/tasks', limiter, task)
app.use('/api/v1/analytics', limiter, analytics)

// health check
app.get('/health', (req, res) => {
  res.status(200).json({
    ok: true,
    status: 'UP',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// --- 404 for unknown routes --------------------------------------------
app.use(notFoundHandler)

// --- Global error handler ----------------------------------------------
app.use(errorHandler)

// --- Process-level error handling --------------------------------------
let isShuttingDown = false

function shutdown (source) {
  if (isShuttingDown) return
  isShuttingDown = true
  logger.warn({ source }, 'Shutting down server gracefully...')
  setTimeout(() => {
    process.exit(1)
  }, 2000).unref()
}

process.on('unhandledRejection', (reason, promise) => {
  logger.error({ error: reason, promise }, 'Unhandled Promise Rejection')
  shutdown('unhandledRejection')
})

process.on('uncaughtException', err => {
  logger.fatal({ error: err, stack: err.stack }, 'Uncaught Exception')
  shutdown('uncaughtException')
})

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))

const PORT = process.env.PORT || 8000

connectDB().then(() => {
  const server = app.listen(PORT, () => {
    logger.info(`Server started on port ${PORT} (${process.env.NODE_ENV || 'development'})`)
  })
})

export default app