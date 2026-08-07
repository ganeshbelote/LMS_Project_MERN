import User from '../models/user.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { success } from '../utils/response.js'
import { jwtSecret } from '../utils/env.js'
import { ConflictError, NotFoundError, UnauthorizedError, DatabaseError } from '../errors/index.js'

/**
 * Normalize a Mongoose user document into a consistent API shape.
 * Both `id` and `_id` are included so the frontend can use either
 * without breaking enrollment checks or profile rendering.
 */
const normalizeUser = (user) => ({
  id: user._id.toString(),
  _id: user._id.toString(),
  username: user.username,
  email: user.email,
  role: user.role,
  enrolledCourses: user.enrolledCourses,
  createdAt: user.createdAt
})

export const register = async (req, res) => {
  const { username, email, password } = req.body

  const usernameExist = await User.findOne({ username })
  if (usernameExist) {
    throw new ConflictError('User already exists with this username!')
  }

  const emailExist = await User.findOne({ email })
  if (emailExist) {
    throw new ConflictError('User already exists with this email!')
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  if (!hashedPassword) {
    throw new DatabaseError('Internal Server Error! Please try again.')
  }

  const user = await User.create({
    username,
    email,
    password: hashedPassword
  })

  if (!user) {
    throw new DatabaseError('Database Error! Please try again.')
  }

  return success(res, {
    statusCode: 200,
    message: 'User created Successfully',
    data: { username, email }
  })
}

export const login = async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user) {
    throw new NotFoundError('User does not exist! Please register.')
  }

  const decodedPassword = await bcrypt.compare(password, user.password)
  if (!decodedPassword) {
    throw new UnauthorizedError('Password is incorrect! Please try again.')
  }

  const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret(), {
    expiresIn: '24h'
  })

  return success(res, {
    statusCode: 200,
    message: 'Successfully Logged In.',
    data: {
      token,
      user: normalizeUser(user)
    }
  })
}

export const getUserData = async (req, res) => {
  const userId = req.body.id || req.body.userId || req.user?.id

  if (!userId) {
    throw new NotFoundError('User ID is required!')
  }

  const user = await User.findById(userId)
  if (!user) {
    throw new NotFoundError('User not found!')
  }

  return success(res, {
    statusCode: 200,
    message: 'User data successfully retrieved!',
    data: normalizeUser(user)
  })
}