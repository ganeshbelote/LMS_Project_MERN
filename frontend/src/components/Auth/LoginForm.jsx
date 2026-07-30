import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { toast } from 'react-toastify'

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) setError(null)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await api.post('/auth/login', formData)
      const data = res.data
      if (data.ok) {
        login(data.token, data.user)
        toast.success(`Welcome back, ${data.user.username}! 🎉`)
        navigate('/')
      } else {
        setError(data.message)
        toast.error(data.message)
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='bg-white rounded-2xl shadow-xl p-8 w-full max-w-md'
      >
        <div className='text-center mb-8'>
          <h2 className='text-3xl font-bold text-blue-600'>!Course</h2>
          <p className='text-gray-500 mt-2'>Welcome back! Sign in to continue</p>
        </div>
        <form onSubmit={handleSubmit} className='space-y-5'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Email
            </label>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all'
              placeholder='you@example.com'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Password
            </label>
            <input
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all'
              placeholder='••••••••'
              required
            />
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className='text-red-500 text-sm text-center bg-red-50 py-2 px-4 rounded-lg'
            >
              {error}
            </motion.p>
          )}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type='submit'
            disabled={loading}
            className='w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all'
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </motion.button>
        </form>
        <p className='mt-6 text-center text-sm text-gray-600'>
          Don't have an account?{' '}
          <Link to='/register' className='text-blue-600 hover:underline font-medium'>
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default LoginForm