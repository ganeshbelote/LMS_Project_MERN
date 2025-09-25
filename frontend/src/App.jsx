import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AdminDashboard from './pages/AdminDashboard.jsx'
import EnrolledCourses from './pages/EnrolledCourses.jsx'
import Dashboard from './components/Dashboard.jsx'
import AddCourses from './pages/AddCourses.jsx'
import CourseDetail from './components/CourseDetail.jsx'
import Profile from './pages/Profile.jsx'
import NotFound from './pages/NotFound.jsx'
import RegisterForm from './components/RegisterForm.jsx'
import LoginForm from './components/LoginForm.jsx'
import Home from './pages/Home.jsx'

function App () {
  const router = createBrowserRouter([
    {
      path: '/login',
      element: <LoginForm />
    },
    {
      path: '/register',
      element: <RegisterForm />
    },
    {
      path: '/',
      element: <Home />,
      // children: [
      //   {
      //     index: true,
      //     path: 'dashboard',
      //     element: <Dashboard />
      //   },
      //   {
      //     path: 'enrolled-courses',
      //     element: <EnrolledCourses />
      //   },
      //   {
      //     path: 'profile',
      //     element: <Profile />
      //   }
      // ]
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
        },
        {
          path: 'profile',
          element: <Profile />
        }
      ]
    },
    {
      path: '/:courseId',
      element: <CourseDetail />
    },
    {
      path: '*',
      element: <NotFound />
    }
  ])

  return <RouterProvider router={router} />
}

export default App
