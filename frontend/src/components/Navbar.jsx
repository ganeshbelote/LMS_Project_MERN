import React, { useEffect } from 'react'
import Logo from '../assets/Logo.svg'
import LogoutArrow from '../assets/LogoutArrow.svg'
import { useNavigate } from "react-router-dom";


const Navbar = () => {
  
  //Handling logout
  const navigate = useNavigate()

  const handleLogout = () =>{
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    navigate('/')
  }

  return (
    <div className='nav w-full h-[12vh] bg-zinc-900 flex items-center justify-between fixed top-0 z-30'
    style={{
        padding:"0 10vw"
    }}
    >
      <div className='logo text-white text-3xl font-extrabold flex items-center gap-5'>
        <img className='h-12' src={Logo} alt="Logo" />
        E-Learning
      </div>
      <div className="options">
        <button className='bg-red-600 text-white text-lg font-semibold font rounded-lg cursor-pointer hover:scale-105 flex items-center gap-3 border-2  border-black'
        style={{
            padding: '10px 15px',
        }}
        onClick={handleLogout}
        ><img className='h-6' src={LogoutArrow} alt="LogoutArrow.svg" />Log Out</button>
      </div>
    </div>
  )
}

export default Navbar
