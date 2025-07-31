import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import ProfBg from '../assets/profbg.jpg'
import userProfile from '../assets/userprof.jpg'

const Profile = () => {
  const [userData, setUserData] = useState({})
  const userId = localStorage.getItem('id')

  useEffect(() => {
    const getUserData = async () => {
      const url = 'http://localhost:8000/api/v1/auth/'
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: userId })
      })
      const user = await res.json()
      setUserData(user.data)
    }
    getUserData()
  }, [])
  return (
    <div className='h-screen w-screen flex items-center justify-center'>
      <Navbar />
      <div
        className='usercard mt-[9vh] rounded-xl shadow-md shadow-black flex flex-col items-center gap-3 p-4 backdrop-blur-md'
        style={{
          backgroundImage: `url(${ProfBg})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Profile Image */}
        <div
          className='h-[30vw] w-[30vw] sm:h-[18vw] sm:w-[18vw] md:h-[12vw] md:w-[12vw] lg:h-[8vw] lg:w-[8vw] rounded-full border-4 border-white bg-gray-200 shadow-lg'
          style={{
            backgroundImage: `url(${userProfile})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>

        {/* Text Info */}
        <h2 className='text-lg sm:text-xl md:text-2xl text-white font-bold text-center'>
          Welcome back 👋
        </h2>
        <h2 className='text-base sm:text-lg md:text-xl text-white font-semibold text-center backdrop-blur-sm'>
          {userData.username}
        </h2>
        <p className='text-sm sm:text-base text-zinc-200 text-center font-medium backdrop-blur-sm'>
          {userData.email}
        </p>
      </div>
    </div>
  )
}

export default Profile
