import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import SideBar from '../components/SideBar'


const AdminDashboard = () => {
  const [role,setRole] = useState(null)
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
      setRole(role)
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
        <SideBar role={role} userData={userData}/>
        <Outlet />
      </div>
    </div>
  )
}

export default AdminDashboard
