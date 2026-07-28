import { motion } from 'framer-motion'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from '../components/Shared/Navbar'
import Footer from '../components/Shared/Footer'
import Sidebar from '../components/Layout/Sidebar.jsx'
import Profilebar from '../components/Layout/Profilebar.jsx'

const Layout = () => {
  return (
    <div className='min-h-screen lg:px-4 w-full overflow-x-hidden bg-gray-100 flex items-center flex-col'>
      <div className='w-full flex flex-1 justify-between'>
        {/* Left Sidebar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className='hidden lg:block w-64 flex-shrink-0'
        >
          <Sidebar />
        </motion.div>
        {/* Main Content */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='flex-1 min-h-screen flex flex-col'
        >
          <div className='w-full flex justify-center'>
            <Navbar />
          </div>
          <div className='flex-1'>
            <Outlet />
          </div>
          <div className='w-full flex justify-center'>
            <Footer />
          </div>
        </motion.main>
        {/* Right Sidebar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className='hidden lg:block w-64 flex-shrink-0'
        >
          <Profilebar />
        </motion.div>
      </div>
    </div>
  )
}

export default Layout