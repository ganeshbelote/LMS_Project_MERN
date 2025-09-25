import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MenuBtn from './MenuBtn.jsx';
// import MenuBtn from './MenuBtn';

const Navbar = ({ isAuthenticated, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = (state) => {
    setIsMenuOpen(state);
  };

  const lmsOptions = [
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
    'Logout',
  ];

  return (
    <header className="w-full max-w-4xl bg-gray-100 p-4 flex justify-between items-center relative">
      <h2 className="text-2xl font-bold text-purple-600">!Course</h2>
      <div className="flex items-center">
        {/* Menu Button for Mobile */}
        <div className="md:hidden">
          <MenuBtn onToggle={handleMenuToggle} />
        </div>
        {/* Desktop Search and Auth */}
        <div className="hidden md:flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search your course..."
            className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 py-2 px-4"
          />
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <img
                src="https://via.placeholder.com/40"
                alt="User"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-sm font-medium text-gray-700">{user.name}</p>
                <p className="text-xs text-gray-500">Continue Your Journey And Achieve</p>
              </div>
            </div>
          ) : (
            <div className="space-x-2">
              <a href="/login" className="text-purple-600 hover:underline">Login</a>
              <a href="/register" className="text-purple-600 hover:underline">Register</a>
            </div>
          )}
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
            className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg rounded-md p-4 z-10"
          >
            {lmsOptions.map((option) => (
              <a
                key={option}
                href={`/${option.toLowerCase()}`}
                className="block p-2 text-purple-600 hover:bg-purple-100 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                {option}
              </a>
            ))}
            {!isAuthenticated && (
              <div className="flex space-x-2 mt-2">
                <Link to="/login" className="text-purple-600 hover:underline">Login</Link>
                <a href="/register" className="text-purple-600 hover:underline">Register</a>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;