import express from 'express'
import { ensureAuth, requireRole } from '../middlewares/ensureAuth.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import {
  getOverallStats,
  getCoursesAnalytics,
  getUsersAnalytics,
  getEnrollmentsAnalytics,
  getRevenueAnalytics
} from '../controllers/analytics.controller.js'

const router = express.Router()

// All analytics routes are admin-only
router.use(ensureAuth, requireRole('admin'))

router.get('/stats', asyncHandler(getOverallStats))
router.get('/courses', asyncHandler(getCoursesAnalytics))
router.get('/users', asyncHandler(getUsersAnalytics))
router.get('/enrollments', asyncHandler(getEnrollmentsAnalytics))
router.get('/revenue', asyncHandler(getRevenueAnalytics))

export default router