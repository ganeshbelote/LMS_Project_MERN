import User from '../models/user.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({
        ok: false,
        message: 'All fields are required !'
      })
    }

    const usernameExist = await User.findOne({ username })

    if (usernameExist) {
      return res.status(401).json({
        ok: false,
        message: 'User already Exist with this username !'
      })
    }

    const emailExist = await User.findOne({ email })

    if (emailExist) {
      return res.status(401).json({
        ok: false,
        message: 'User already Exist with this email !'
      })
    }

    if (password.length < 4) {
      return res.status(400).json({
        ok: false,
        message: 'Password should contain minimum 4 characters !'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    if (!hashedPassword) {
      return res.status(500).json({
        ok: false,
        message: 'Internal Server Error ! Please Try again.'
      })
    }

    const user = await User.create({
      username,
      email,
      password: hashedPassword
    })

    if (!user) {
      return res.status(500).json({
        ok: false,
        message: 'Database Error ! Please Try again.'
      })
    }

    return res.status(200).json({
      ok: true,
      message: 'User created Successfully 🌸',
      username
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Internal Server Error ! Please Try again.'
    })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: 'All fields are required !'
      })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({
        ok: false,
        message: 'User not Exist ! Please Register.'
      })
    }

    const decodedPassword = await bcrypt.compare(password, user.password)

    if (!decodedPassword) {
      return res.status(401).json({
        ok: false,
        message: 'Password is Incorrect ! Please Try again.'
      })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_CODE, {
      expiresIn: '24h'
    })

    return res.status(200).json({
      ok: true,
      message: 'Successfully Logged In.',
      token,
      user: { id: user._id, username: user.username, role: user.role }
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Internal Server Error ! Please Try again.'
    })
  }
}

export const getUserData = async (req, res) => {
  try {
    const userId = req.body.id
    const user = await User.findById(userId)
    if (!user) {
      return res.status(500).json({
        ok: false,
        message: 'User Not Found !'
      })
    }
    return res.status(200).json({
      ok: true,
      message: 'User data successfully retrieved !',
      data : user
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Failed to retrive user data !'
    })
  }
}
