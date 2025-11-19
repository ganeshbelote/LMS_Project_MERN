import profImg from '../../assets/image/userprof.jpg'
import menuSvg from '../../assets/svg/menu.svg'
import inboxImg from '../../assets/image/envelope.png'
import userImg from '../../assets/image/user.png'
import notificationImg from '../../assets/svg/notification.svg'
import { useNavigate } from 'react-router-dom'

const Profilebar = () => {
  const navigate = useNavigate()
  const mentors = [
    { name: 'Killiam Roosevelt', role: 'Software Developer' },
    { name: 'Teodor Maskevich', role: 'Product Owner' },
    { name: 'Andrew Kooler', role: 'Frontend Developer' },
    { name: 'Adam Chekish', role: 'Backend Developer' },
    { name: 'Anton Peterson', role: 'Software Developer' },
    { name: 'Matew Jackson', role: 'Product Designer' }
  ]

  return (
    <div className='z-10 min-h-screen fixed top-0 right-0 bg-white w-64 p-4 rounded-lg shadow-lg flex flex-col justify-between'>
      <div>
        <div className='mb-5 w-full flex justify-between items-center'>
          <h3 className='font-semibold text-gray-500'>Your Profile</h3>
          <button className='cursor-pointer' type='button'>
            <img className='h-6' src={menuSvg} alt='menu' />
          </button>
        </div>
        <div className='flex flex-col items-center gap-4 mb-8'>
          <img
            src={profImg}
            alt='Profile'
            className='w-24 h-24 rounded-full border-4 border-blue-600'
          />
          <div className='flex flex-col items-center text-center'>
            <p className='text-lg font-medium text-gray-700'>
              Good Morning Alex
            </p>
            <p className='text-sm text-gray-500'>
              Continue Your Journey And Achieve Your Target
            </p>
          </div>
        </div>
        <div className='flex justify-around'>
          <img className='p-2 border-2 rounded-full h-10 w-10 hover:scale-105 active:scale-100 transition-all duration-300 cursor-pointer' src={notificationImg} alt="notification" onClick={() => navigate('/inbox')}/>
          <img className='p-2 border-2 rounded-full h-10 w-10 hover:scale-105 active:scale-100 transition-all duration-300 cursor-pointer' src={inboxImg} alt="inbox" onClick={() => navigate('/inbox')}/>
          <img className='p-2 border-2 rounded-full h-10 w-10 hover:scale-105 active:scale-100 transition-all duration-300 cursor-pointer' src={userImg} alt="user" onClick={() => navigate('/profile')}/>
        </div>
      </div>
    </div>
  )
}

export default Profilebar
