import jwt from 'jsonwebtoken'
import { jwtSecret } from '../utils/env.js'
import { UnauthorizedError, ForbiddenError } from '../errors/index.js'

export const ensureAuth = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : req.body.token

  if (!token) {
    return next(new UnauthorizedError('Authentication required. Please login.'))
  }

  try {
    const decoded = jwt.verify(token, jwtSecret())
    req.user = decoded
    next()
  } catch (error) {
    return next(new UnauthorizedError('Invalid or expired token. Please login again.'))
  }
}

/**
 * Middleware factory to require a specific role (admin-only routes).
 */
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'))
    }
    const userRole = req.user.role?.toLowerCase()
    if (!roles.map(r => r.toLowerCase()).includes(userRole)) {
      return next(new ForbiddenError('Access denied. You do not have permission to perform this action.'))
    }
    next()
  }
}

export default ensureAuth