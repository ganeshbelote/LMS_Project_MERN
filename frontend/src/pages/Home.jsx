import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import CourseContainer from '../components/CourseContainer'
import Navbar from '../components/Navbar'

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true) // For simulated data/image load

  useEffect(() => {
    // Simulate authentication check
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthenticated(true)
      setUser({ name: 'Alex', email: 'alex@example.com' })
    }
    // Simulate short loading time for skeleton
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col items-center px-4'>
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeIn' }}
        className='bg-purple-200 rounded-lg shadow-lg p-6 w-full max-w-4xl text-center'
      >
        <h3 className='text-xl font-semibold text-white mb-4'>
          Sharpen Your Skills With Professional Online Courses
        </h3>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className='bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800'
        >
          Join Now
        </motion.button>
      </motion.div>

      {/* Courses Grid */}
      <div className='mt-6 w-fit text-white'>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='contents'
        >
          <CourseContainer isLoading={isLoading} />
        </motion.div>
      </div>
    </div>
  )
}

export default Home
