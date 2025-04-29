import express from "express"
import {register , login, getUserData} from '../controllers/auth.controller.js'

const router = express.Router()

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/').post(getUserData)


export default router