import express from 'express'
import {
  createTask,
  getUserTasks,
  updateTask,
  toggleTaskComplete,
  deleteTask
} from '../controllers/task.controller.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import { validate } from '../middlewares/validate.js'
import {
  createTaskSchema,
  getTasksSchema,
  updateTaskSchema,
  toggleTaskSchema,
  deleteTaskSchema
} from '../schemas/index.js'

const router = express.Router()

router.route('/').post(validate(getTasksSchema), asyncHandler(getUserTasks))
router.route('/create').post(validate(createTaskSchema), asyncHandler(createTask))
router.route('/update').post(validate(updateTaskSchema), asyncHandler(updateTask))
router.route('/toggle').post(validate(toggleTaskSchema), asyncHandler(toggleTaskComplete))
router.route('/delete').post(validate(deleteTaskSchema), asyncHandler(deleteTask))

export default router