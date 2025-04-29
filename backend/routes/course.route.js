import express from "express";
import { addCourse, cancleEnroll, checkEnrollment, deleteCourse, enrollCourse, getAllEnrollments, getCourseDetail } from "../controllers/course.controller.js";
import { getAllCourses } from "../controllers/course.controller.js";
import { ensureAuth } from '../middlewares/ensureAuth.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

router.route("/").post(
  upload.fields([{ name: "thumbnail", maxCount: 1 }, { name: "videos", maxCount: 5 }]),
  addCourse
)

        .get(getAllCourses)

router.route('/courseDetails').post(getCourseDetail)
router.route('/enrollCourse').post(enrollCourse)
router.route('/cancleEnroll').post(cancleEnroll)
router.route('/checkEnrollment').post(checkEnrollment)
router.route('/getAllEnrollments').post(getAllEnrollments)
router.route('/deleteCourse').delete(deleteCourse)



export default router;
