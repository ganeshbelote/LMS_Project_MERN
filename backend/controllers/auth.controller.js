import User from '../models/user.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { success } from '../utils/response.js'
import { ConflictError, NotFoundError, UnauthorizedError, DatabaseError } from '../errors/index.js'

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
    data: { username }
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

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_CODE, {
    expiresIn: '24h'
  })

  return success(res, {
    statusCode: 200,
    message: 'Successfully Logged In.',
    data: {
      token,
      user: { id: user._id, username: user.username, role: user.role }
    }
  })
}

export const getUserData = async (req, res) => {
  const userId = req.body.id
  const user = await User.findById(userId)
  if (!user) {
    throw new NotFoundError('User not found!')
  }

  return success(res, {
    statusCode: 200,
    message: 'User data successfully retrieved!',
    data: user
  })
}