import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import { toast } from 'react-toastify'
import { Bell, Clock, Users, Award, PlayCircle, CheckCircle, Lock, ArrowLeft, BookOpen, ExternalLink, Edit3 } from 'lucide-react'
import VideoPlayer from '../components/Shared/VideoPlayer'

const CourseDetail = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated, role } = useAuth()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [enrolling, setEnrolling] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [error, setError] = useState(null)
  const [selectedVideo, setSelectedVideo] = useState(null)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.post('/courses/courseDetails', { id: courseId })
        if (res.data.ok) {
          setCourse(res.data.data)
          // Check enrollment
          if (user?._id) {
            const enrollRes = await api.post('/courses/checkEnrollment', {
              userId: user._id,
              courseId
            })
            setIsEnrolled(enrollRes.data.isEnrolled)
          }
        } else {
          setError('Course not found')
        }
      } catch (err) {
        setError('Failed to load course details')
      } finally {
        setLoading(false)
      }
    }
    fetchCourse()
  }, [courseId, user])

  // Auto-select first video when enrolled
  useEffect(() => {
    if (isEnrolled && course?.videos?.length > 0 && !selectedVideo) {
      setSelectedVideo(course.videos[0])
    }
  }, [isEnrolled, course, selectedVideo])

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setEnrolling(true)
    try {
      // Use _id, id, or localStorage fallback to handle different user object formats
      const userId = user?._id || user?.id || localStorage.getItem('id')
      if (!userId) {
        toast.error('User not found. Please login again.')
        setEnrolling(false)
        return
      }
      const res = await api.post('/courses/enrollCourse', {
        userId,
        courseId
      })
      if (res.data.ok) {
        setIsEnrolled(true)
        toast.success('Successfully enrolled! 🎉')
      } else {
        toast.error(res.data.message || 'Enrollment failed')
      }
    } catch (err) {
      console.error('❌ Enrollment error:', err)
      toast.error(err.response?.data?.message || 'Enrollment failed. Please try again.')
    } finally {
      setEnrolling(false)
    }
  }

  const handleVideoSelect = (video) => {
    setSelectedVideo(video)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Course Not Found</h2>
          <p className="text-gray-500 mb-4">{error || 'This course does not exist'}</p>
          <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const progress = isEnrolled ? 60 : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-72 md:h-96 bg-blue-600 overflow-hidden">
        {course.thumbnail && (
          <img 
            src={course.thumbnail} 
            alt={course.title}
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        <div className="absolute top-4 left-4 z-10">
          <button onClick={() => navigate(-1)} className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
        
        <div className="relative h-full flex items-end px-6 pb-8 max-w-7xl mx-auto">
          <div className="text-white">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-bold mb-3"
            >
              {course.title}
            </motion.h1>
            <p className="text-white/80 text-lg mb-4 max-w-2xl">{course.description}</p>
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm md:text-base">
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-yellow-400" /> 4.8
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" /> 1,247 students
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> {course.videos?.length || 0} lessons
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                ₹{course.price}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 -mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player Section (shown when enrolled and video selected) */}
            {isEnrolled && selectedVideo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <VideoPlayer 
                  videoUrl={selectedVideo.url} 
                  videoTitle={selectedVideo.title}
                />
              </motion.div>
            )}

            {/* Course Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
            >
              {isEnrolled && (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-bold text-gray-800">Your Progress</h3>
                    <span className="text-2xl font-bold text-blue-600">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                {isEnrolled ? (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      if (course.videos?.length > 0) {
                        setSelectedVideo(course.videos[0])
                        setActiveTab('curriculum')
                      }
                    }}
                    className="flex-1 bg-blue-600 text-white py-3 md:py-4 px-6 md:px-8 rounded-xl font-semibold text-base md:text-lg shadow-lg flex items-center justify-center gap-3 hover:bg-blue-700 transition"
                  >
                    <PlayCircle className="w-5 h-5 md:w-6 md:h-6" />
                    Continue Learning
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="flex-1 bg-green-600 text-white py-3 md:py-4 px-6 md:px-8 rounded-xl font-semibold text-base md:text-lg shadow-lg flex items-center justify-center gap-3 hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {enrolling ? 'Enrolling...' : `Enroll for ₹${course.price}`}
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 md:p-4 bg-white border-2 border-blue-600 rounded-xl shadow-lg hover:bg-blue-50 transition"
                >
                  <Bell className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                </motion.button>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <div className="flex gap-6 md:gap-8 overflow-x-auto">
                  {['overview', 'curriculum'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-4 px-1 capitalize font-medium transition-colors whitespace-nowrap ${
                        activeTab === tab 
                          ? 'text-blue-600 border-b-2 border-blue-600' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">About this course</h3>
                    <p className="text-gray-600 leading-relaxed">{course.description}</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Course Content</h3>
                    <p className="text-gray-600">{course.videos?.length || 0} video lessons</p>
                  </div>
                </div>
              )}

              {activeTab === 'curriculum' && (
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold mb-4">
                    Course Content ({course.videos?.length || 0} videos)
                  </h3>
                  {!course.videos || course.videos.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No videos available yet</p>
                  ) : (
                    course.videos.map((video, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ x: 3 }}
                        onClick={() => {
                          if (isEnrolled) {
                            setSelectedVideo(video)
                          }
                        }}
                        className={`bg-gray-50 rounded-xl p-4 md:p-6 transition-all hover:shadow-md ${
                          isEnrolled ? 'cursor-pointer' : 'cursor-default'
                        } ${selectedVideo?.url === video.url ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 md:gap-4">
                            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              selectedVideo?.url === video.url 
                                ? 'bg-blue-600 text-white' 
                                : isEnrolled 
                                  ? 'bg-green-100 text-green-600'
                                  : 'bg-gray-200 text-gray-400'
                            }`}>
                              {isEnrolled ? (
                                <PlayCircle className="w-5 h-5" />
                              ) : (
                                <Lock className="w-5 h-5" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-semibold text-sm md:text-base truncate">
                                {video.title || `Lecture ${index + 1}`}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {index === 0 ? 'Getting started' : `Chapter ${index + 1}`}
                              </p>
                            </div>
                          </div>
                          {!isEnrolled && <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                          {isEnrolled && (
                            <ExternalLink className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <h3 className="text-lg font-bold mb-6">Course Includes</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <PlayCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm">Videos</p>
                    <p className="text-gray-500 text-sm truncate">{course.videos?.length || 0} lessons</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm">Certificate</p>
                    <p className="text-gray-500 text-sm">Upon completion</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Price Card */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <h3 className="text-2xl font-bold text-blue-600 mb-4">₹{course.price}</h3>
              {!isEnrolled ? (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50"
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
              ) : (
                <div className="bg-green-50 text-green-700 text-center py-3 rounded-xl font-semibold">
                  ✓ You're enrolled
                </div>
              )}
            </motion.div>

            {/* Admin Actions - Edit Course */}
            {role?.toLowerCase() === 'admin' && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-blue-500"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-4">Admin Actions</h3>
                <button
                  onClick={() => navigate(`/edit-course/${courseId}`)}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-5 h-5" /> Edit Course
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetail