import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Play, Clock, Users } from 'lucide-react'

const CourseCard = ({
  about = 'Development',
  Id,
  title,
  instructor,
  progress,
  image,
  price,
  description
}) => {

  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate(`/course/${Id}`);
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer transition-shadow hover:shadow-md'
      onClick={handleRedirect}
    >
      <div className='relative h-40 bg-gray-200 overflow-hidden'>
        {image ? (
          <img
            src={image}
            alt={title}
            className='w-full h-full object-cover'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200'>
            <Play className="w-10 h-10 text-blue-400" />
          </div>
        )}
        {price && (
          <div className='absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-lg'>
            ₹{price}
          </div>
        )}
      </div>
      <div className='p-4'>
        <span className='inline-block px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-md mb-2'>
          {about}
        </span>
        <h3 className='font-semibold text-gray-800 mb-1 line-clamp-1'>{title}</h3>
        {description && (
          <p className='text-xs text-gray-500 mb-3 line-clamp-2'>{description}</p>
        )}
        <div className='flex items-center justify-between text-xs text-gray-500'>
          <span className='flex items-center gap-1'>
            <Users className="w-3 h-3" />
            {instructor || 'Instructor'}
          </span>
          {progress !== undefined && (
            <span className='flex items-center gap-1 text-blue-600 font-medium'>
              <Clock className="w-3 h-3" />
              {progress}%
            </span>
          )}
        </div>
        {progress > 0 && (
          <div className='mt-3 w-full bg-gray-100 rounded-full h-1.5'>
            <div
              className='bg-blue-600 h-1.5 rounded-full transition-all'
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default CourseCard