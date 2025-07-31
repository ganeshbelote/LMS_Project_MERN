import React, { useEffect, useState } from 'react'
import Logo from '../assets/Logo.svg'
import LogoutArrow from '../assets/LogoutArrow.svg'
import { useNavigate } from 'react-router-dom'
import menuSvg from '../assets/menu.svg'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false)
  //Handling logout
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('id')
    localStorage.removeItem('role')
    navigate('/')
  }

  return (
    <div className='nav p-2 px-10 lg:px-[10vw] w-full h-[63.2px] lg:h-[12vh] bg-zinc-900 flex items-center justify-between fixed top-0 z-30'>
      <div className='logo text-white text-xl md:text-2xl lg:text-3xl font-extrabold flex items-center gap-5'>
        <img className='md:h-8 lg:h-12' src={Logo} alt='Logo' />
        E-Learning
      </div>
      <div className='options relative'>
        <button
          className='hidden bg-red-600 py-2 px-5 text-white text-lg font-semibold font rounded-lg cursor-pointer hover:scale-105 md:hidden lg:flex items-center gap-1 border-2  border-black'
          onClick={handleLogout}
        >
          <img className='h-4 lg:h-6' src={LogoutArrow} alt='LogoutArrow.svg' />
          Log Out
        </button>
        <button
          onClick={() => setShowMenu(prev => !prev)}
          className='cursor-pointer block h-6 w-6 lg:hidden'
        >
          <img src={menuSvg} alt='menuBtn' />
        </button>
        {showMenu && (
          <ul className='menuoptions rounded-2xl rounded-tr-none text-white absolute right-0 top-8 bg-black p-4 lg:hidden flex flex-col gap-3 '>
            <NavLink to='/Home/dashboard' className={({ isActive }) =>`cursor-pointer ${isActive && "text-blue-600 font-bold"}`}>
              Home
            </NavLink>
            <NavLink to='/profile' className={({ isActive }) =>`cursor-pointer ${isActive && "text-blue-600 font-bold"}`}>
              Profile
            </NavLink>
            <NavLink
              to='/Home/enrolled-courses'
              className={({ isActive }) =>`cursor-pointer text-nowrap ${isActive && "text-blue-600 font-bold"}`}
            >
              Enrolled Courses
            </NavLink>
            <li>
              <button
                className='text-nowrap flex-nowrap flex-row bg-red-600 py-2 px-5 text-white text-lg font-semibold rounded-lg cursor-pointer hover:scale-105 flex gap-1.5 items-center justify-center border-2 border-black'
                onClick={handleLogout}
              >
                <img
                  className='h-4 lg:h-6'
                  src={LogoutArrow}
                  alt='LogoutArrow.svg'
                />
                <span>Log Out</span>
              </button>
            </li>
          </ul>
        )}
      </div>
    </div>
  )
}

export default Navbar
