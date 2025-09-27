import { motion } from 'framer-motion'
import Navbar from '../components/Shared/Navbar'
import Footer from '../components/Shared/Footer'
import Sidebar from '../components/Layout/Sidebar.jsx'
import Profilebar from '../components/Layout/Profilebar.jsx'
import Home from '../components/Layout/Home.jsx'

const Layout = () => {
  return (
    <div className='min-h-screen lg:px-4 w-full overflow-x-hidden bg-gray-100 flex items-center flex-col'>
      <div className='w-full flex flex-1 justify-between'>
        {/* Left Sidebar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className='hidden lg:block w-64'
        >
          <Sidebar />
        </motion.div>
        {/* Main Content */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='flex-1'
        >
          <div className='w-full flex justify-center'>
            <Navbar isAuthenticated={true} user={{ name : 'Ganesh'}}/>
          </div>
          <Home />
          <div className='w-full flex justify-center'>
            <Footer />
          </div>
        </motion.main>
        {/* Right Sidebar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className='hidden lg:block w-64'
        >
          <Profilebar />
        </motion.div>
      </div>
    </div>
  )
}

export default Layout
