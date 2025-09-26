import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Profilebar from '../components/Profilebar';
import Footer from '../components/Footer';
import Home from './Home';

const Layout = () => {
  return (
    <div className="min-h-screen lg:px-4 w-full overflow-x-hidden bg-gray-100 flex items-center flex-col">
      <Navbar />
      <div className="w-full flex flex-1 justify-between">
        {/* Left Sidebar */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:block w-64"
        >
          <Sidebar />
        </motion.div>
        {/* Main Content */}
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1"
        >
          <Home />
        </motion.main>
        {/* Right Sidebar */}
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:block w-64"
        >
          <Profilebar />
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;