import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import Hero from '../components/Shared/Hero'
import CourseCard from '../components/Shared/CourseCard'
import { Search, BookOpen, Users, Clock, TrendingUp } from 'lucide-react'

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [courses, setCourses] = useState([])
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user, role } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, enrollRes] = await Promise.all([
          api.get('/courses/'),
          api.post('/courses/getAllEnrollments', { userId: user?._id || localStorage.getItem('id') })
        ])
        if (coursesRes.data.ok) {
          setCourses(coursesRes.data.data)
        }
        if (enrollRes.data.ok) {
          setEnrolledCourses(enrollRes.data.data)
        }
      } catch (err) {
        setError('Failed to load courses')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  const filteredCourses = courses.filter(course =>
    course.title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = [
    { label: 'Total Courses', value: courses.length, icon: BookOpen, color: 'bg-blue-500' },
    { label: 'Enrolled', value: enrolledCourses.length, icon: Users, color: 'bg-green-500' },
    { label: 'In Progress', value: enrolledCourses.filter(c => c.progress && c.progress < 100).length, icon: Clock, color: 'bg-orange-500' },
    { label: 'Completed', value: enrolledCourses.filter(c => c.progress && c.progress >= 100).length, icon: TrendingUp, color: 'bg-purple-500' },
  ]

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-48 bg-gray-200 rounded-xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-200 rounded-xl" />)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="h-64 bg-gray-200 rounded-xl" />)}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Hero Section */}
      <Hero />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4"
          >
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white rounded-xl shadow-sm border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
        />
      </div>

      {/* Course Grid */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">All Courses</h2>
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No courses found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((course, i) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <CourseCard
                  Id={course._id}
                  title={course.title}
                  instructor={course.instructor || 'Instructor'}
                  progress={course.progress || 0}
                  image={course.thumbnail}
                  about={course.category || 'Development'}
                  price={course.price}
                  description={course.description}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard