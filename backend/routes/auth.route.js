import express from 'express'
import { register, login, getUserData } from '../controllers/auth.controller.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import { validate } from '../middlewares/validate.js'
import { registerSchema, loginSchema, userIdSchema } from '../schemas/index.js'

const router = express.Router()

router.route('/register').post(validate(registerSchema), asyncHandler(register))
router.route('/login').post(validate(loginSchema), asyncHandler(login))
router.route('/').post(validate(userIdSchema), asyncHandler(getUserData))

export default router