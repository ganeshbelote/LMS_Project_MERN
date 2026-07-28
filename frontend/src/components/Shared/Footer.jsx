import { motion } from 'framer-motion'

const Footer = () => {
  return (
    <div className='footer w-full max-w-4xl relative overflow-x-hidden px-6 pb-8 pt-6 flex flex-col items-center'>
      <div className='footer-up w-full my-5 lg:mt-8 flex gap-5 flex-wrap items-end justify-between'>
        <ul className='px-1 flex gap-3 lg:gap-5 text-gray-500'>
          <li className='hover:text-blue-600 text-sm font-medium cursor-pointer transition-colors'>Terms & Conditions</li>
          <li className='hover:text-blue-600 text-sm font-medium cursor-pointer transition-colors'>Privacy Policy</li>
          <li className='hover:text-blue-600 text-sm font-medium cursor-pointer transition-colors'>Support</li>
        </ul>
        <h2 className='text-lg text-gray-600'>info.course@gmail.com</h2>
      </div>
      <div className='footer-white-line my-2 w-4/5 h-px bg-gray-300 rounded-full'></div>
      <div className="footer-bottom w-full flex gap-5 flex-wrap items-end justify-between">
        <h2 className='text-3xl font-bold text-blue-600'>!Course</h2>
        <p className='text-sm text-gray-500'>@2025 !Course. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Footer