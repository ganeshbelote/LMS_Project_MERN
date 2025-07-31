import { useMemo } from 'react'
import './App.css'
import Auth from './pages/Auth.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import UserDashboard from './pages/UserDashboard.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import EnrolledCourses from './pages/EnrolledCourses.jsx'
import Dashboard from './components/Dashboard.jsx'
import AddCourses from './pages/AddCourses.jsx'
import CourseDetail from './components/CourseDetail.jsx'
import { useEffect, useState } from 'react'
import Profile from './pages/Profile.jsx'

function App () {
  const [responsive, setResponsive] = useState(null) // initially null

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth
      setResponsive(screenWidth >= 1130)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const router = useMemo(() => {
    if (responsive === null) return null // don't create router until responsive is known
    return createBrowserRouter([
      {
        path: '/',
        element: <Auth responsive={responsive} />
      },
      {
        path: '/Home',
        element: <UserDashboard />,
        children: [
          {
            index: true,
            path: 'dashboard',
            element: <Dashboard />
          },
          {
            path: 'enrolled-courses',
            element: <EnrolledCourses />
          }
        ]
      },
      {
        path: '/Admin',
        element: <AdminDashboard />,
        children: [
          {
            index: true,
            path: 'dashboard',
            element: <Dashboard />
          },
          {
            path: 'add-courses',
            element: <AddCourses />
          }
        ]
      },
      {
        path: '/:courseId',
        element: <CourseDetail />
      },
      {
        path: '/profile',
        element: <Profile />
      }
    ])
  }, [responsive])

  if (router === null) return null // or show a loading spinner

  return <RouterProvider router={router} />
}

export default App
