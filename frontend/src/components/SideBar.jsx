import { useEffect, useState } from 'react'
import ProfBg from '../assets/profbg.jpg'
import userProfile from '../assets/userprof.jpg'
import Navbar from '../components/Navbar.jsx'
import { NavLink, Outlet } from 'react-router-dom'

const SideBar = ({ role, userData }) => {
  const [dashboardRoute, setDashboardRoute] = useState(null)

  useEffect(() => {
    const role = localStorage.getItem('role')

    if (role == 'admin') {
      setDashboardRoute('/Admin/dashboard')
    } else {
      setDashboardRoute('/Home/dashboard')
    }
  }, [])

  return (
    <div
      className='sidebar z-10 min-h-screen w-[80vw] hidden lg:w-[20vw] bg-gradient-to-b from-blue-500 to-violet-500 lg:flex flex-col items-center gap-6 fixed top-0 left-0 overflow-y-auto'
      style={{
        paddingTop: '14vh',
        paddingBottom: '2rem'
      }}
    >
      <div className='w-full bg-gradient-to-r from-[#1E2836] to-[#121928] relative'>
        <div>
          <Navbar />
        </div>
        <div className='flex'>
          <div
            className='sidebar z-10 min-h-screen w-[80vw] sm:w-[40vw] md:w-[30vw] lg:w-[20vw] bg-gradient-to-b from-blue-500 to-violet-500 flex flex-col items-center gap-6 fixed top-0 left-0 overflow-y-auto'
            style={{
              paddingTop: '14vh',
              paddingBottom: '2rem'
            }}
          >
            {/* User Card */}
            <div
              className='usercard w-[85%] rounded-xl shadow-md shadow-black flex flex-col items-center gap-3 p-4 backdrop-blur-md'
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

            {/* Navigation Links */}
            <NavLink
              to={dashboardRoute}
              className={({ isActive }) =>
                `w-[85%] px-4 py-2 rounded-lg text-center text-base font-semibold shadow-md transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-black border-2 border-black'
                    : 'bg-zinc-100 text-black'
                }`
              }
            >
              Dashboard
            </NavLink>

            {role == 'user' ? (
              <NavLink
                to='/Home/enrolled-courses'
                className={({ isActive }) =>
                  `w-[85%] px-4 py-2 rounded-lg text-center text-base font-semibold shadow-md transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-black border-2 border-black'
                      : 'bg-zinc-100 text-black'
                  }`
                }
              >
                Enrolled Courses
              </NavLink>
            ) : (
              <NavLink
                to='/Admin/add-courses'
                className={({ isActive }) =>
                  `w-[85%] px-4 py-2 rounded-lg text-center text-base font-semibold shadow-md transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-black border-2 border-black'
                      : 'bg-zinc-100 text-black'
                  }`
                }
              >
                Add Courses
              </NavLink>
            )}
          </div>

          {/* Main Content */}
          <div className='flex-1 ml-[80vw] sm:ml-[40vw] md:ml-[30vw] lg:ml-[20vw]'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SideBar
