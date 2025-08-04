import { ToastContainer } from 'react-toastify'
import Form from '../components/Form.jsx'

const Auth = () => {
  return (
    <div className='h-screen w-screen flex items-center justify-center'>
      <Form/>
      <ToastContainer position='top-right' autoClose={3000} />
    </div>
  )
}

export default Auth
