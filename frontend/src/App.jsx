import './App.css'
import Auth from './pages/Auth.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import UserDashboard from './pages/UserDashboard.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import EnrolledCourses from './pages/EnrolledCourses.jsx'
import Dashboard from './components/Dashboard.jsx'
import AddCourses from './pages/AddCourses.jsx'
import CourseDetail from './components/CourseDetail.jsx'


function App () {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Auth />
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
      path:'/:courseId',
      element:<CourseDetail/>
    }
  ])

  return <RouterProvider router={router} />
}

export default App
