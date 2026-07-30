import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const MenuBtn = forwardRef(function MenuBtn({ onToggle }, ref) {
  const [active, setActive] = useState(false)

  // Expose close method to parent
  useImperativeHandle(ref, () => ({
    close: () => {
      setActive(false)
      onToggle?.(false)
    }
  }))

  const handleClick = () => {
    const newState = !active
    setActive(newState)
    onToggle?.(newState)
  }

  return (
    <div
      className='flex-shrink-0 relative rounded-md flex items-center justify-center cursor-pointer'
      onClick={handleClick}
    >
      <motion.div
        className='absolute inset-0 rounded-md'
        animate={{
          borderColor: 'rgb(113 113 122)'
        }}
        transition={{ duration: 0.3 }}
      />

      <AnimatePresence>
        {active && (
          <motion.div
            className='absolute inset-0 rounded-md'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      <motion.div
        className='relative z-10 flex flex-col items-end justify-center space-y-1.5'
        initial={false}
        animate={active ? 'open' : 'closed'}
      >
        <motion.span
          className='block h-[3px] rounded bg-black'
          variants={{
            closed: { rotate: 0, y: 0, width: '24px' },
            open: { rotate: 45, y: 6, width: '24px' }
          }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />
        <motion.span
          className='block h-[3px] rounded bg-black'
          variants={{
            closed: { opacity: 1, width: '18px' },
            open: { opacity: 0, width: 0 }
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
        <motion.span
          className='block h-[3px] rounded bg-black'
          variants={{
            closed: { rotate: 0, y: 0, width: '10px' },
            open: { rotate: -45, y: -6, width: '24px' }
          }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />
      </motion.div>
    </div>
  )
})

export default MenuBtn