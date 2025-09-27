import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MenuBtn from './MenuBtn.jsx'

const Navbar = ({ isAuthenticated, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleMenuToggle = state => {
    setIsMenuOpen(state)
  }

  const lmsOptions = [
    'Profile',
    'Dashboard',
    'Courses',
    'Progress',
    'Announcements',
    'Assignments',
    'Quizzes',
    'Grades',
    'Community',
    'Resources',
    'Settings',
    'Logout'
  ]

  return (
    <header className='w-full max-w-4xl bg-gray-100 p-4 flex justify-between items-center relative'>
      <h2 className='text-2xl font-bold text-blue-600'>!Course</h2>
      <div className='flex items-center'>
        {/* Menu Button for Mobile */}
        <div className='lg:hidden'>
          <MenuBtn onToggle={handleMenuToggle} />
        </div>
        {/* Desktop Search and Auth */}
        <div className='min-w-78 hidden lg:flex items-center space-x-4'>
          <input
            type='text'
            placeholder='Search your course...'
            className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-4'
          />
        </div>
      </div>
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className='lg:hidden absolute top-full left-0 w-full bg-white shadow-lg rounded-md p-4 z-10'
          >
            {lmsOptions.map(option => (
              <a
                key={option}
                href={`/${option.toLowerCase()}`}
                className='block p-2 text-blue-600 hover:bg-blue-100 rounded'
                onClick={() => setIsMenuOpen(false)}
              >
                {option}
              </a>
            ))}
            {!isAuthenticated && (
              <div className='flex space-x-2 mt-2'>
                <a href='/login' className='text-blue-600 hover:underline'>
                  <button className='bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-800'>
                    Login
                  </button>
                </a>
                <a href='/register' className='text-blue-600 hover:underline'>
                  <button className='bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-800'>
                    Register
                  </button>
                </a>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
