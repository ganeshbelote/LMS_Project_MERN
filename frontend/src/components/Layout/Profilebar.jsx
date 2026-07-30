import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Bell, Inbox as InboxIcon, User, Menu } from 'lucide-react'

const Profilebar = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className='z-10 min-h-screen fixed top-0 right-0 bg-white w-64 p-5 rounded-lg shadow-lg flex flex-col'>
      <div>
        <div className='mb-6 flex justify-between items-center'>
          <h3 className='font-semibold text-gray-500'>Your Profile</h3>
          <button className='cursor-pointer' type='button'>
            <Menu className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className='flex flex-col items-center gap-4 mb-8'>
          <div className='w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold border-4 border-blue-300'>
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className='flex flex-col items-center text-center'>
            <p className='text-lg font-medium text-gray-700'>
              {user?.username || 'User'}
            </p>
            <p className='text-xs text-gray-400'>{user?.email || ''}</p>
            <p className='text-sm text-gray-500 mt-1'>
              Continue Your Journey And Achieve Your Target
            </p>
          </div>
        </div>
        <div className='flex justify-around'>
          <button
            onClick={() => navigate('/inbox')}
            className='p-2.5 border-2 border-gray-200 rounded-full hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer'
          >
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => navigate('/profile')}
            className='p-2.5 border-2 border-gray-200 rounded-full hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer'
          >
            <User className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profilebar