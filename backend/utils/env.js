import logger from './logger.js'

/**
 * Validate required environment variables fail-fast at startup.
 * Prevents the server from starting with missing critical config.
 *
 * Supported keys (with legacy aliases):
 *   - MONGODB_URI (alias: MONGO_URL)
 *   - JWT_SECRET  (alias: JWT_SECRET_CODE)
 */
const getEnv = (key, aliases = []) => {
  if (process.env[key]) return process.env[key]
  for (const alias of aliases) {
    if (process.env[alias]) return process.env[alias]
  }
  return undefined
}

export const validateEnv = () => {
  const missing = []
  if (!getEnv('MONGODB_URI', ['MONGO_URL'])) missing.push('MONGODB_URI (or MONGO_URL)')
  if (!getEnv('JWT_SECRET', ['JWT_SECRET_CODE'])) missing.push('JWT_SECRET (or JWT_SECRET_CODE)')

  if (missing.length > 0) {
    logger.fatal(
      { missing },
      `Missing required environment variables: ${missing.join(', ')}`
    )
    process.exit(1)
  }

  if (process.env.NODE_ENV === 'production') {
    const missingProd = [
      'CLOUDINARY_CLOUD_NAME',
      'CLOUDINARY_API_KEY',
      'CLOUDINARY_API_SECRET'
    ].filter(key => !process.env[key])

    if (missingProd.length > 0) {
      logger.fatal(
        { missing: missingProd },
        `Missing required production environment variables: ${missingProd.join(', ')}`
      )
      process.exit(1)
    }
  }
}

/**
 * Get an env var with fallback and legacy alias support.
 * @param {string} key - Primary env var name
 * @param {string[]} aliases - Legacy aliases to check
 * @param {string} fallback - Default value if not found
 */
export const env = (key, aliases = [], fallback = '') =>
  getEnv(key, aliases) || fallback

/**
 * Get the JWT secret (supports JWT_SECRET and legacy JWT_SECRET_CODE).
 */
export const jwtSecret = () =>
  getEnv('JWT_SECRET', ['JWT_SECRET_CODE']) || ''

/**
 * Get the MongoDB URI (supports MONGODB_URI and legacy MONGO_URL).
 */
export const mongoUri = () =>
  getEnv('MONGODB_URI', ['MONGO_URL']) || ''

export default validateEnv