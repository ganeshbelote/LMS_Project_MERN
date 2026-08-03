import { ValidationError } from '../errors/index.js'

/**
 * Validate request data against a Zod schema.
 *
 * Usage:
 *   router.post('/register', validate(registerSchema, 'body'), register)
 *
 * @param {import('zod').ZodSchema} schema - The Zod schema to validate against
 * @param {'body'|'query'|'params'} source - Which part of the request to validate
 */
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const result = schema.safeParse(req[source])
    if (!result.success) {
      const details = result.error.issues.map(issue => ({
        path: issue.path.join('.'),
        message: issue.message
      }))
      return next(new ValidationError('Validation failed', details))
    }
    // Replace the request field with the parsed (sanitized) data
    req[source] = result.data
    next()
  }
}

export default validate