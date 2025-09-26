import { motion } from 'framer-motion'
import bellSvg from '../assets/svg/bell.svg'
import menuSvg from '../assets/svg/menu.svg'

const ProgressTab = ({ Title, Progress }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className='bg-white rounded-lg shadow-md p-4 flex gap-4'
    >
      <div className="notification-wrapper h-12 w-12 rounded-full bg-blue-300 border-2 border-blue-500 flex items-center justify-center">
        <img className='p-2' src={bellSvg} alt="bell" />
      </div>
      <div className='content'>
        <p className='text-sm text-gray-600'>{Progress}</p>
        <p className='font-medium'>{Title}</p>
      </div>
      <button className='cursor-pointer' type='button'>
        <img className='h-6' src={menuSvg} alt="menu" />
      </button>
    </motion.div>
  )
}

export default ProgressTab
