import React from 'react';
import { motion } from 'framer-motion';

const CourseCard = ({ title, instructor, progress, image }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="bg-white rounded-lg shadow-md p-4 w-3xs"
    >
      <img src={image} alt={title} className="w-full h-32 object-cover rounded-md mb-2" />
      <h3 className="text-lg font-medium text-purple-600">{title}</h3>
      <p className="text-sm text-gray-600">Instructor: {instructor}</p>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
        <div 
          className="bg-purple-600 h-2.5 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-600 mt-1">{progress}% Watched</p>
    </motion.div>
  );
};

export default CourseCard;