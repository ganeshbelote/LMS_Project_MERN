import { motion } from 'framer-motion'

const CourseCard = ({
  about = 'Development',
  title,
  instructor,
  progress,
  image
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className='bg-white rounded-lg shadow-md p-4 w-3xs text-black flex flex-col justify-between'
    >
      <div className='up-section'>
        <img
          src={image}
          alt={title}
          className='w-full h-32 object-cover rounded-md mb-2'
        />
        <h3 className='mt-2 py-1 px-2 bg-blue-300 w-fit rounded-lg font-medium text-sm text-blue-600'>
          {about}
        </h3>
        <h3 className='mt-1 text-lg font-medium'>{title}</h3>
        <p className='text-sm text-gray-600'>Instructor: {instructor}</p>
      </div>
      <div className='content'>
        <div className='w-full bg-gray-200 rounded-full h-2.5 mt-2'>
          <div
            className='bg-blue-600 h-2.5 rounded-full'
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className='text-sm text-gray-600 mt-1'>{progress}% Watched</p>
      </div>
    </motion.div>
  )
}

export default CourseCard
