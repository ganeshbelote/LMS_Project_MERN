import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProgressContainer from '../Shared/ProgressContainer.jsx'
import CourseContainer from '../Shared/CourseContainer.jsx'
import Hero from '../Shared/Hero.jsx'

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
    <div className='bg-gray-100 flex flex-col items-center px-4'>
      {/* Hero Section */}
      <Hero />
      {/*Progress tabs*/}
      <ProgressContainer />

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
