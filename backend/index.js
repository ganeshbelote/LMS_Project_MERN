import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import rateLimit from 'express-rate-limit'

import { connectDB } from './database/db.js'

import auth from './routes/auth.route.js'
import course from './routes/course.route.js'

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('public'))

const PORT = process.env.PORT || 3000

connectDB()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, slow down.'
})

app.use('/api/v1/auth', limiter, auth)
app.use('/api/v1/courses', limiter, course)

app.listen(PORT, () => {
  console.log(`Server is started on ${PORT}`)
})
