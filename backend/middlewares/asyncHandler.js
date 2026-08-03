/**
 * Wrap an async route handler so any rejected promise is forwarded
 * to Express's error-handling middleware automatically.
 *
 * Usage:
 *   router.get('/', asyncHandler(async (req, res) => {
 *     const data = await someAsync()
 *     return success(res, { data })
 *   }))
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

export default asyncHandler