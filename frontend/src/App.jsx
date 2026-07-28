import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Dashboard from './pages/Dashboard.jsx'
import AddCourses from './pages/AddCourses.jsx'
import CourseDetail from './pages/CourseDetail.jsx'
import Profile from './pages/Profile.jsx'
import NotFound from './pages/NotFound.jsx'
import RegisterForm from './components/Auth/RegisterForm.jsx'
import LoginForm from './components/Auth/LoginForm.jsx'
import Layout from './pages/Layout.jsx'
import EnrolledCourses from './pages/EnrolledCourses.jsx'
import Inbox from './pages/Inbox.jsx'
import Task from './pages/Task.jsx'

function App () {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const router = createBrowserRouter([
    {
      path: '/login',
      element: isAuthenticated ? <Navigate to="/" replace /> : <LoginForm />
    },
    {
      path: '/register',
      element: isAuthenticated ? <Navigate to="/" replace /> : <RegisterForm />
    },
    {
      path: '/',
      element: isAuthenticated ? <Layout /> : <Navigate to="/login" replace />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: 'enrolled-courses', element: <EnrolledCourses /> },
        { path: 'profile', element: <Profile /> },
        { path: 'inbox', element: <Inbox /> },
        { path: 'task', element: <Task /> },
        { path: 'add-courses', element: <AddCourses /> },
      ]
    },
    {
      path: '/course/:courseId',
      element: isAuthenticated ? <CourseDetail /> : <Navigate to="/login" replace />
    },
    {
      path: '*',
      element: <NotFound />
    }
  ])

  return <RouterProvider router={router} />
}

export default App