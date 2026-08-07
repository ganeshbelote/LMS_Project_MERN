/**
 * API base URL resolution.
 *
 * Priority:
 *   1. VITE_API_URL environment variable (set in .env or Netlify dashboard)
 *   2. Fallback to the production Render URL
 *
 * No hardcoded localhost URLs should remain in production code.
 */
const baseUrl = import.meta.env.VITE_API_URL || 'https://lms-web-by-ganesh.onrender.com/api/v1'

export default baseUrl
