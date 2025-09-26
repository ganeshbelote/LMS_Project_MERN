import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <div className='footer w-full max-w-4xl relative overflow-x-hidden px-6 pb-8 flex flex-col items-center'>
      <div className='footer-up w-full my-5 lg:mt-8 flex gap-5 flex-wrap items-end justify-between'>
        <ul className='px-1 flex gap-3 lg:gap-5 text-[#858585]'>
          <li className='hover:text-blue-600 text-sm font-medium'>Terms & Conditions</li>
          <li className='hover:text-blue-600 text-sm font-medium'>Privacy Policy</li>
          <li className='hover:text-blue-600 text-sm font-medium'>Support</li>
        </ul>
        <h2 className='email text-xl'>info.course@gmail.com</h2>
      </div>
      <div className='footer-white-line my-2 w-4/5 h-[1px] bg-black rounded-full'></div>
      <div className="footer-bottom w-full flex gap-5 flex-wrap items-end justify-between">
        <h2 className='text-3xl font-bold text-blue-600'>!Course</h2>
        <p className='text-sm text-[#858585]'>@2025 @Course. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
