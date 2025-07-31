import React, { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import Form from '../components/Form.jsx'

const Auth = ({ responsive }) => {
  return (
    <div className='h-screen w-screen flex items-center justify-center'>
      <Form responsive={responsive}/>
      <ToastContainer position='top-right' autoClose={3000} />
    </div>
  )
}

export default Auth
