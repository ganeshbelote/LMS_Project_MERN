import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import MenuBtn from './MenuBtn.jsx'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, user, logout, role } = useAuth()
  const navigate = useNavigate()
  const menuBtnRef = useRef(null)

  const handleMenuToggle = state => {
    setIsMenuOpen(state)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
    if (menuBtnRef.current) {
      menuBtnRef.current.close()
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  const lmsOptions = [
    { label: 'Dashboard', path: '/' },
    { label: 'Courses', path: '/' },
    { label: 'Enrolled Courses', path: '/enrolled-courses' },
    { label: 'Profile', path: '/profile' },
    { label: 'Inbox', path: '/inbox' },
    { label: 'Tasks', path: '/task' },
  ]

  // Add admin-only options for admin users in mobile menu
  if (role?.toLowerCase() === 'admin') {
    lmsOptions.push({ label: 'Add Course', path: '/add-courses' })
    lmsOptions.push({ label: 'Analytics', path: '/admin-analytics' })
  }

  return (
    <header className='w-full max-w-4xl bg-gray-100 p-4 flex justify-between items-center relative'>
      <Link to="/" className='text-2xl font-bold text-blue-600'>!Course</Link>
      <div className='flex items-center gap-3'>
        {isAuthenticated && user && (
          <div className='hidden lg:flex items-center gap-2 bg-white rounded-full px-4 py-1.5 shadow-sm'>
            <div className='w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold'>
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className='text-sm font-medium text-gray-700' onClick={()=> navigate("/profile")}>{user?.username || 'User'}</span>
          </div>
        )}
        <div className='lg:hidden'>
          <MenuBtn ref={menuBtnRef} onToggle={handleMenuToggle} />
        </div>
        <div className='hidden lg:flex items-center space-x-3'>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className='bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm font-medium transition-colors'
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className='text-blue-600 font-medium hover:underline'>Login</Link>
              <Link to="/register" className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium'>Register</Link>
            </>
          )}
        </div>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className='lg:hidden absolute top-full left-0 w-full bg-white shadow-lg rounded-md p-4 z-50'
          >
            {lmsOptions.map(option => (
              <Link
                key={option.label}
                to={option.path}
                className='block p-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors'
                onClick={closeMenu}
              >
                {option.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <button
                onClick={() => { handleLogout(); closeMenu(); }}
                className='w-full mt-2 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 text-sm font-medium'
              >
                Logout
              </button>
            ) : (
              <div className='flex space-x-2 mt-2'>
                <Link to='/login' className='flex-1 text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 text-sm font-medium' onClick={closeMenu}>Login</Link>
                <Link to='/register' className='flex-1 text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 text-sm font-medium' onClick={closeMenu}>Register</Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar