import React, { useState } from 'react'
import { successMsg, failureMsg } from '../utils/message.js'
import { ToastContainer } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Auth = () => {
  const navigate = useNavigate()

  //Adding animations for Registration and Login of User
  const [animate, setAnimate] = useState(false)
  const handleAnimation = () => {
    setAnimate(prev => !prev)
  }

  //handling register data
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: ''
  })

  const handleRegisterChange = e => {
    const { name, value } = e.target
    const copy = { ...registerData, [name]: value }
    setRegisterData(copy)
  }

  const handleRegister = async () => {
    const { username, email, password } = registerData
    if (!username || !email || !password) {
      return failureMsg('All fields are required !')
    }
    try {
      const url = 'http://localhost:8000/api/v1/auth/register'

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerData)
      })

      const result = await res.json()

      if (result.ok) {
        successMsg(result.message)
        setRegisterData({
          username: '',
          email: '',
          password: ''
        })
        setAnimate(prev => !prev)
      } else {
        setRegisterData({
          username: '',
          email: '',
          password: ''
        })
        failureMsg(result.message)
      }
    } catch (error) {
      return failureMsg('Internal Server Error !')
    }
  }

  //handling Login

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  const handleLoginChange = e => {
    const { name, value } = e.target
    const copy = { ...loginData, [name]: value }
    setLoginData(copy)
  }

  const handleLogin = async () => {
    const { email, password } = loginData
    if (!email || !password) {
      return failureMsg('All fields are required !')
    }
    try {
      const url = 'http://localhost:8000/api/v1/auth/login'

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      })

      const result = await res.json()

      if (result.ok) {
        successMsg(result.message)
        setLoginData({
          email: '',
          password: ''
        })
        localStorage.setItem('token', result.token)
        localStorage.setItem('id', result.user.id)
        localStorage.setItem('role', result.user.role)
        if (result.user.role === 'admin') {
          navigate('/Admin')
        } else {
          navigate('/Home')
        }
      } else {
        failureMsg(result.message)
      }
    } catch (error) {
      return failureMsg('Internal Server Error !')
    }
  }

  return (
    <div className='h-screen w-screen flex items-center justify-center'>
      <div className='form shadow-xl shadow-black relative h-[70vh] w-[60vw] bg-amber-100 flex items-center justify-center gap-5 rounded-2xl overflow-hidden '>
        <div className='register w-[45%] h-[90%] rounded-2xl flex flex-col items-center justify-around '>
          <h2
            className='text-3xl font-bold'
            style={{
              margin: '15px 0 20px 0 '
            }}
          >
            Register
          </h2>
          <input
            className='rounded-lg text-lg font-semibold outline-0 border-0 bg-white focus:outline-2 outline-blue-600'
            type='text'
            style={{
              padding: '10px 30px 10px 15px'
            }}
            placeholder='Username'
            name='username'
            onChange={handleRegisterChange}
            value={registerData.username}
          />
          <input
            className='rounded-lg text-lg font-semibold outline-0 border-0 bg-white focus:outline-2 outline-blue-600'
            type='text'
            style={{
              padding: '10px 30px 10px 15px'
            }}
            placeholder='Email'
            name='email'
            onChange={handleRegisterChange}
            value={registerData.email}
          />
          <input
            className='rounded-lg text-lg font-semibold outline-0 border-0 bg-white focus:outline-2 outline-blue-600'
            type='text'
            style={{
              padding: '10px 30px 10px 15px'
            }}
            placeholder='Password'
            name='password'
            onChange={handleRegisterChange}
            value={registerData.password}
          />
          <button
            className='bg-blue-600 text-white text-lg font-semibold font rounded-lg cursor-pointer hover:scale-105'
            style={{
              padding: '10px 15px',
              marginBottom: '15px'
            }}
            onClick={handleRegister}
          >
            Register
          </button>
        </div>
        <div className='login w-[45%] h-[90%] rounded-2xl flex flex-col items-center justify-around  '>
          <h2
            className='text-3xl font-bold'
            style={{
              margin: '15px 0 20px 0 '
            }}
          >
            Login
          </h2>
          <input
            className='rounded-lg text-lg font-semibold outline-0 border-0 bg-white focus:outline-2 outline-blue-600'
            type='text'
            style={{
              padding: '10px 30px 10px 15px'
            }}
            placeholder='Email'
            name='email'
            onChange={handleLoginChange}
            value={loginData.email}
          />
          <input
            className='rounded-lg text-lg font-semibold outline-0 border-0 bg-white focus:outline-2 outline-blue-600'
            type='text'
            style={{
              padding: '10px 30px 10px 15px'
            }}
            placeholder='Password'
            name='password'
            onChange={handleLoginChange}
            value={loginData.password}
          />
          <button
            className='bg-blue-600 text-white text-lg font-semibold font rounded-lg cursor-pointer hover:scale-105'
            style={{
              padding: '10px 18px',
              marginBottom: '15px'
            }}
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
        <div
          className='absolute text-white h-full w-full rounded-[60px] flex items-center justify-center gap-5 bg-blue-600'
          style={{
            left: animate ? '-50%' : '50%',
            transition: 'all 0.5s ease-in-out'
          }}
        >
          <div className='left w-[45%] h-[90%] rounded-2xl flex flex-col items-center justify-center '>
            <h2
              className='text-3xl font-bold'
              style={{
                marginBottom: '25px'
              }}
            >
              Welcome back !
            </h2>
            <p className='text-center text-lg font-semibold'>
              To keep connected with us <br /> please login.
            </p>
            <button
              className='bg-white border-2 border-blue-600 text-black text-lg font-semibold font rounded-lg cursor-pointer hover:scale-105 shadow-black shadow-2xl'
              style={{
                padding: '8px 18px 10px 18px',
                marginTop: '25px'
              }}
              onClick={handleAnimation}
            >
              Login
            </button>
          </div>
          <div className='right w-[45%] h-[90%] rounded-2xl flex flex-col items-center justify-center '>
            <h2
              className='text-3xl font-bold'
              style={{
                marginBottom: '25px'
              }}
            >
              Hello, Friend !
            </h2>
            <p className='text-center text-lg font-semibold'>
              Enter your details to <br /> join us.
            </p>
            <button
              className='bg-white border-2 border-blue-600 text-black text-lg font-semibold font rounded-lg cursor-pointer hover:scale-105 shadow-black shadow-2xl'
              style={{
                padding: '8px 18px 10px 18px',
                marginTop: '25px'
              }}
              onClick={handleAnimation}
            >
              Register
            </button>
          </div>
        </div>
      </div>
      <ToastContainer position='top-right' autoClose={3000} />
    </div>
  )
}

export default Auth
