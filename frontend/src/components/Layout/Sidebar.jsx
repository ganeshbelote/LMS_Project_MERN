import { NavLink } from 'react-router-dom'
import homeImg from '../../assets/image/home.png'
import inboxImg from '../../assets/image/envelope.png'
import bookImg from '../../assets/image/book.png'
import checklistImg from '../../assets/image/checklist.png'
import peopleImg from '../../assets/image/people.png'
import settingImg from '../../assets/image/setting.png'
import exitImg from '../../assets/image/exit.png'

const Sidebar = () => {
  return (
    <div className='z-10 min-h-screen fixed top-0 left-0 bg-white w-64 p-4 rounded-lg shadow-lg flex flex-col justify-between'>
      <div>
        <div className='space-y-4'>
          <h3 className='text-sm text-gray-500 font-medium'>OVERVIEW</h3>
          <NavLink
            to='/'
            className={({ isActive }) =>
              `flex items-center space-x-1.5 rounded-lg py-1 px-2 ${
                isActive
                  ? 'text-blue-600 bg-blue-100'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-100'
              }`
            }
          >
            <img className='h-6 -ml-0.5' src={homeImg} alt='home' />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to='/inbox'
            className={({ isActive }) =>
              `flex items-center space-x-2 rounded-lg py-1 px-2 ${
                isActive
                  ? 'text-blue-600 bg-blue-100'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-100'
              }`
            }
          >
            <img className='h-5' src={inboxImg} alt='inbox' />
            <span>Inbox</span>
          </NavLink>

          <NavLink
            to='/lesson'
            className={({ isActive }) =>
              `flex items-center space-x-2 rounded-lg py-1 px-2 ${
                isActive
                  ? 'text-blue-600 bg-blue-100'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-100'
              }`
            }
          >
            <img className='h-5' src={bookImg} alt='book' />
            <span>Lesson</span>
          </NavLink>

          <NavLink
            to='/task'
            className={({ isActive }) =>
              `flex items-center space-x-2 rounded-lg py-1 px-2 ${
                isActive
                  ? 'text-blue-600 bg-blue-100'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-100'
              }`
            }
          >
            <img className='h-4.5' src={checklistImg} alt='checklist' />
            <span>Task</span>
          </NavLink>

          <NavLink
            to='/group'
            className={({ isActive }) =>
              `flex items-center space-x-2 rounded-lg py-1 px-2 ${
                isActive
                  ? 'text-blue-600 bg-blue-100'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-100'
              }`
            }
          >
            <img className='h-5' src={peopleImg} alt='people' />
            <span>Group</span>
          </NavLink>
        </div>
      </div>
      <div className='space-y-2'>
        <h3 className='text-sm text-gray-500 font-medium'>SETTINGS</h3>
        <NavLink
          to='/settings'
          className={({ isActive }) =>
            `flex items-center space-x-2 rounded-lg py-1 px-2 ${
              isActive
                ? 'text-blue-600 bg-blue-100'
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-100'
            }`
          }
        >
          <img className='h-4.5' src={settingImg} alt='settings' />
          <span>Settings</span>
        </NavLink>
        <NavLink
          to='/logout'
          className={({ isActive }) =>
            `flex items-center space-x-2 rounded-lg py-1 px-2 ${
              isActive
                ? 'text-red-600 bg-red-100'
                : 'text-red-600 hover:bg-red-100'
            }`
          }
        >
          <img className='h-4 ml-0.5' src={exitImg} alt='logout' />
          <span>Logout</span>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
