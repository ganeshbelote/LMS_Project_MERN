import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, BookOpen, Users, Inbox, CheckSquare, Settings, LogOut, PlusCircle, BarChart3 } from 'lucide-react'

const Sidebar = () => {
  const { role, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Enrolled Courses', path: '/enrolled-courses', icon: BookOpen },
    { label: 'Inbox', path: '/inbox', icon: Inbox },
    { label: 'Tasks', path: '/task', icon: CheckSquare },
  ]

  if (role === 'admin') {
    navItems.push({ label: 'Add Course', path: '/add-courses', icon: PlusCircle })
    navItems.push({ label: 'Analytics', path: '/admin-analytics', icon: BarChart3 })
  }

  return (
    <div className='z-10 min-h-screen fixed top-0 left-0 bg-white w-64 p-5 rounded-lg shadow-lg flex flex-col justify-between'>
      <div>
        <div className='mb-6 px-2'>
          <h2 className='text-2xl font-bold text-blue-600'>!Course</h2>
          <p className='text-xs text-gray-400 mt-1'>Learning Management</p>
        </div>
        <div className='space-y-1'>
          <h3 className='text-xs text-gray-400 font-semibold uppercase tracking-wider px-2 mb-2'>Main Menu</h3>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg py-2.5 px-3 transition-all ${
                  isActive
                    ? 'text-blue-600 bg-blue-50 font-medium'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
      <div className='space-y-1 pt-4 border-t border-gray-100'>
        <h3 className='text-xs text-gray-400 font-semibold uppercase tracking-wider px-2 mb-2'>Account</h3>
        <NavLink
          to='/profile'
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg py-2.5 px-3 transition-all ${
              isActive
                ? 'text-blue-600 bg-blue-50 font-medium'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`
          }
        >
          <Settings className="w-5 h-5" />
          <span>Profile</span>
        </NavLink>
        <button
          onClick={handleLogout}
          className='w-full flex items-center gap-3 rounded-lg py-2.5 px-3 text-red-500 hover:bg-red-50 transition-all cursor-pointer'
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar