import express from "express";
import { addCourse, cancelEnroll, checkEnrollment, deleteCourse, enrollCourse, getAllEnrollments, getCourseDetail } from "../controllers/course.controller.js";
import { getAllCourses } from "../controllers/course.controller.js";
import { ensureAuth } from '../middlewares/ensureAuth.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

// Public routes
router.route("/").get(getAllCourses);
router.route('/courseDetails').post(getCourseDetail);

// Protected routes (require auth)
router.route('/enrollCourse').post(ensureAuth, enrollCourse);
router.route('/cancelEnroll').post(ensureAuth, cancelEnroll);
router.route('/checkEnrollment').post(ensureAuth, checkEnrollment);
router.route('/getAllEnrollments').post(ensureAuth, getAllEnrollments);

// Admin-only routes
router.route("/").post(
  ensureAuth,
  (req, res, next) => {
    // Check if user is admin (case-insensitive)
    if (req.user?.role?.toLowerCase() !== 'admin') {
      return res.status(403).json({
        ok: false,
        message: 'Access denied! Only admins can add courses.'
      });
    }
    next();
  },
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "videos", maxCount: 5 }
  ]),
  addCourse
);

router.route('/deleteCourse').delete(ensureAuth, (req, res, next) => {
  if (req.user?.role?.toLowerCase() !== 'admin') {
    return res.status(403).json({
      ok: false,
      message: 'Access denied! Only admins can delete courses.'
    });
  }
  next();
}, deleteCourse);

export default router;