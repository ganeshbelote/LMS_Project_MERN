import { motion } from 'framer-motion'
import bgImg from '../../assets/image/bg.jpg'

const Hero = () => {
  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeIn' }}
        className='bg-blue-200 rounded-lg shadow-lg p-6 w-full min-h-64 max-w-4xl text-center bg-center bg-cover bg-no-repeat flex flex-col items-center justify-center'
        style={{
          backgroundImage : `linear-gradient(to bottom, rgba(59, 130, 246, 0.7), rgba(59, 130, 246, 0.3)),url(${bgImg})`
        }}
      >
        <h3 className='text-xl font-semibold text-white mb-4'>
          Sharpen Your Skills With Professional Online Courses
        </h3>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className='bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800'
        >
          Join Now
        </motion.button>
      </motion.div>
  )
}

export default Hero