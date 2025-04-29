import React, { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ProfBg from '../assets/profbg.jpg'
import adminProfile from '../assets/adminprof.png'


const AdminDashboard = () => {
  const userId = localStorage.getItem('id')
  const [userData, setUserData] = useState({})
  const navigate = useNavigate()
  //Ensure Authentication
  useEffect(() => {
    const id = localStorage.getItem('id')
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    if (!token || !id || !role) {
      navigate('/')
    } else {
      if (role === 'admin') {
        navigate('/Admin/dashboard')
      } else {
        navigate('/')
      }
    }
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
    <div>
      <Navbar />
      <div className='flex'>
        <div
          className='sidebar z-10 min-h-[100vh] w-[20vw] bg-gradient-to-b from-blue-500 to-violet-500 flex flex-col items-center gap-3 fixed top-0 left-0'
          style={{
            padding: '14vh 0'
          }}
        >
          <div
            className='usercard h-[50vh] w-[80%] rounded-lg shadow-lg shadow-black flex flex-col items-center gap-2'
            style={{
              backgroundImage: `url(${ProfBg})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              padding:"3% 0"
            }}
          >
            <div
              className='thumbnail h-[10vw] w-[10vw] rounded-full bg-amber-300 border-2 border-black'
              style={{
                backgroundImage: `url(${adminProfile})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
            ></div>
            <h2 className='text-3xl text-center text-white font-bold '>
              Welcome back👋
            </h2>
            <h2 className='text-2xl text-white font-bold backdrop-blur-sm'>
              {userData.username}
            </h2>
            <p className='text-md font-semibold text-zinc-500 text-center backdrop-blur-sm'>
              {userData.email}
            </p>
          </div>
          <NavLink
            to='/Admin/dashboard'
            className={({ isActive }) =>
              isActive
                ? 'w-[80%] bg-zinc-50 border-2 border-black rounded-lg text-center text-lg font-semibold shadow-md shadow-black'
                : 'w-[80%] bg-zinc-50 rounded-lg text-center text-lg font-semibold shadow-md shadow-black'
            }
            style={{
              padding: '8px 10px'
            }}
          >
            Dashboard
          </NavLink>
          <NavLink
            to='/Admin/add-courses'
            className={({ isActive }) =>
              isActive
                ? 'w-[80%] bg-zinc-50 border-2 border-black rounded-lg text-center text-lg font-semibold shadow-md shadow-black'
                : 'w-[80%] bg-zinc-50 rounded-lg text-center text-lg font-semibold shadow-md shadow-black'
            }
            style={{
              padding: '8px 10px'
            }}
          >
            Add Courses
          </NavLink>
        </div>
        <Outlet />
      </div>
    </div>
  )
}

export default AdminDashboard
