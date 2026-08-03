import express from 'express'
import { addCourse, cancelEnroll, checkEnrollment, deleteCourse, enrollCourse, getAllEnrollments, getCourseDetail, updateCourse, getAllCourses } from '../controllers/course.controller.js'
import { ensureAuth, requireRole } from '../middlewares/ensureAuth.js'
import { upload } from '../middlewares/multer.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import { validate } from '../middlewares/validate.js'
import {
  courseDetailSchema,
  enrollSchema,
  cancelEnrollSchema,
  checkEnrollmentSchema,
  getAllEnrollmentsSchema,
  courseIdSchema
} from '../schemas/index.js'

const router = express.Router()

// Public routes
router.route('/').get(asyncHandler(getAllCourses))
router.route('/courseDetails').post(validate(courseDetailSchema), asyncHandler(getCourseDetail))

// Protected routes (require auth)
router.route('/enrollCourse').post(ensureAuth, validate(enrollSchema), asyncHandler(enrollCourse))
router.route('/cancelEnroll').post(ensureAuth, validate(cancelEnrollSchema), asyncHandler(cancelEnroll))
router.route('/checkEnrollment').post(ensureAuth, validate(checkEnrollmentSchema), asyncHandler(checkEnrollment))
router.route('/getAllEnrollments').post(ensureAuth, validate(getAllEnrollmentsSchema), asyncHandler(getAllEnrollments))

// Admin-only routes
router.route('/').post(
  ensureAuth,
  requireRole('admin'),
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'videos', maxCount: 5 }
  ]),
  asyncHandler(addCourse)
)

router.route('/updateCourse/:id').put(
  ensureAuth,
  requireRole('admin'),
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'videos', maxCount: 5 }
  ]),
  asyncHandler(updateCourse)
)

router.route('/deleteCourse').delete(
  ensureAuth,
  requireRole('admin'),
  validate(courseIdSchema),
  asyncHandler(deleteCourse)
)

export default router