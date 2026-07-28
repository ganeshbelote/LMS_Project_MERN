import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import bgImg from '../../assets/image/bg.jpg'

const Hero = () => {
  const navigate = useNavigate()

  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeIn' }}
        className='bg-blue-600 rounded-2xl shadow-lg p-6 md:p-10 w-full min-h-48 max-w-4xl text-center bg-center bg-cover bg-no-repeat flex flex-col items-center justify-center relative overflow-hidden'
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(59, 130, 246, 0.85), rgba(37, 99, 235, 0.7)),url(${bgImg})`
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <h3 className='text-2xl md:text-3xl font-bold text-white mb-3'>
            Sharpen Your Skills With Professional Online Courses
          </h3>
          <p className='text-blue-100 mb-6 max-w-lg mx-auto'>
            Discover, Learn, and Upskill with our wide range of expert-led courses
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const el = document.getElementById('courses-section')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}
            className='bg-white text-blue-600 font-semibold py-2.5 px-6 rounded-xl hover:bg-blue-50 transition shadow-lg'
          >
            Explore Courses
          </motion.button>
        </div>
      </motion.div>
  )
}

export default Hero