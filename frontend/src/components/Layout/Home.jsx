import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import CourseCard from '../Shared/CourseCard'
import Hero from '../Shared/Hero'
import { BookOpen } from 'lucide-react'

const Home = () => {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses/')
      if (res.data.ok) {
        setCourses(res.data.data)
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  const filteredCourses = courses.filter(course =>
    course.title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className='bg-gray-100 flex flex-col items-center px-4 py-6'>
      <Hero />

      {/* Search */}
      <div className="mt-6 w-full max-w-4xl">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full px-5 py-3 bg-white rounded-xl shadow-sm border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
        />
      </div>

      {/* Courses Grid */}
      <div className='mt-6 w-full max-w-4xl'>
        <h2 className='text-2xl font-bold text-blue-600 mb-4'>Available Courses</h2>
        {loading ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {[1,2,3].map(i => (
              <div key={i} className='bg-gray-200 rounded-xl h-64 animate-pulse' />
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No courses found</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {filteredCourses.map(course => (
              <CourseCard
                key={course._id}
                Id={course._id}
                title={course.title}
                instructor={course.instructor || 'Instructor'}
                progress={course.progress || 0}
                image={course.thumbnail}
                about={course.category || 'Development'}
                price={course.price}
                description={course.description}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home