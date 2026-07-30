import express from "express"
import {
  createTask,
  getUserTasks,
  updateTask,
  toggleTaskComplete,
  deleteTask
} from '../controllers/task.controller.js'

const router = express.Router()

router.route('/').post(getUserTasks)
router.route('/create').post(createTask)
router.route('/update').post(updateTask)
router.route('/toggle').post(toggleTaskComplete)
router.route('/delete').post(deleteTask)

export default router