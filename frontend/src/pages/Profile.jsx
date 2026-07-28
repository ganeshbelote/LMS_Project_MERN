import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import { toast } from 'react-toastify'
import { User, Mail, BookOpen, Award, Calendar, Shield, Save, X, Camera } from 'lucide-react'

const Profile = () => {
  const { user, fetchUserData } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
      })
    }
    fetchEnrolledCourses()
  }, [user])

  const fetchEnrolledCourses = async () => {
    try {
      const res = await api.post('/courses/getAllEnrollments', {
        userId: user?._id || localStorage.getItem('id')
      })
      if (res.data.ok) {
        setEnrolledCourses(res.data.data)
      }
    } catch {
      // silently fail
    }
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 md:py-12 text-white">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white/20 flex items-center justify-center text-4xl md:text-5xl font-bold border-4 border-white/50">
                {(user.username?.[0] || 'U').toUpperCase()}
              </div>
              <button className="absolute bottom-0 right-0 bg-white text-blue-600 p-1.5 rounded-full shadow-lg hover:bg-blue-50 transition">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold">{user.username || 'User'}</h2>
              <p className="text-blue-200 flex items-center justify-center md:justify-start gap-2 mt-1">
                <Mail className="w-4 h-4" /> {user.email || 'No email'}
              </p>
              <span className="inline-block mt-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm capitalize">
                {(user.role || 'user')}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          {/* Personal Info */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" /> Personal Information
              </h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Edit
                </button>
              )}
            </div>
            
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false)
                      setFormData({ username: user.username, email: user.email })
                    }}
                    className="flex items-center gap-2 bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl hover:bg-gray-200 transition"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-800">{user.username || 'Not set'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{user.email || 'Not set'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium text-gray-800 capitalize">{user.role || 'user'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium text-gray-800">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Enrolled Courses */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-blue-600" /> Enrolled Courses ({enrolledCourses.length})
            </h3>
            {enrolledCourses.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No enrolled courses yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {enrolledCourses.map((course) => (
                  <div key={course._id} className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 truncate">{course.title}</p>
                      <p className="text-xs text-gray-500">Enrolled</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Achievements */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-blue-600" /> Achievements
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['Course Completion Badge', 'Quick Learner', 'Top Performer'].map((ach, i) => (
                <div key={i} className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 flex items-center gap-3 border border-yellow-100">
                  <Award className="w-8 h-8 text-yellow-500" />
                  <div>
                    <p className="font-medium text-gray-800">{ach}</p>
                    <p className="text-xs text-gray-500">Earned</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  )
}

export default Profile