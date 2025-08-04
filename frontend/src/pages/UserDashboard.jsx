import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import SideBar from '../components/SideBar.jsx'

const UserDashboard = () => {
  const [role, setRole] = useState(null)
  const [userData, setUserData] = useState({})
  const userId = localStorage.getItem('id')
  const navigate = useNavigate()
  //Ensure Authentication
  useEffect(() => {
    const id = localStorage.getItem('id')
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    if (!token || !id || !role) {
      navigate('/')
    } else {
      setRole(role)
      if (role === 'user') {
        navigate('/Home/dashboard')
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
    <div className='w-full bg-gradient-to-r from-[#1E2836] to-[#121928] relative'>
      <div>
        <Navbar />
      </div>
      <div className='flex relative'>
        <SideBar role={role} userData={userData} />

        {/* Main Content */}
        <div className='flex-1 lg:ml-[20vw] overflow-x-hidden'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
