import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import VideoPlayer from '../components/Shared/VideoPlayer'
import { BookOpen, PlayCircle, X, ChevronRight, Clock, Film, ListVideo } from 'lucide-react'

const EnrolledCourses = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    fetchEnrollments()
  }, [])

  const fetchEnrollments = async () => {
    try {
      const res = await api.post('/courses/getAllEnrollments', {
        userId: user?.id || user?._id || localStorage.getItem('id')
      })
      if (res.data.ok) {
        setEnrollments(res.data.data)
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  const openCourse = (course) => {
    setSelectedCourse(course)
    setCurrentIndex(0)
  }

  const changeVideo = (index) => {
    setCurrentIndex(index)
  }

  const handleEnded = () => {
    if (selectedCourse?.videos && currentIndex < selectedCourse.videos.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="animate-pulse space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-200 rounded-xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">My Enrolled Courses</h2>
        <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
          {enrollments.length} courses
        </span>
      </div>

      {enrollments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Enrolled Courses</h3>
          <p className="text-gray-500 mb-6">Start learning by enrolling in a course</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition font-medium"
          >
            Browse Courses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enrollments.map((course, i) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => openCourse(course)}
            >
              <div className="flex flex-col sm:flex-row">
                <div className="relative h-32 sm:h-auto sm:w-40 flex-shrink-0 bg-gray-100">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Film className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <PlayCircle className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div className="p-4 flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">{course.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{course.description}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Film className="w-3.5 h-3.5" />
                      {course.videos?.length || 0} videos
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      In Progress
                    </span>
                  </div>
                </div>
                <div className="hidden sm:flex items-center pr-4">
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Video Player Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-2 md:p-4">
          <div className="bg-gray-900 rounded-2xl w-full max-w-6xl h-[95vh] md:h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 flex-shrink-0">
              <div className="min-w-0">
                <h3 className="text-white font-semibold truncate">
                  {selectedCourse.title}
                </h3>
                <p className="text-gray-400 text-xs truncate">
                  {selectedCourse.videos?.[currentIndex]?.title || 'Video'} • {currentIndex + 1}/{selectedCourse.videos?.length || 0}
                </p>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-gray-700 transition flex-shrink-0"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content - flex row on desktop, column on mobile */}
            <div className="flex flex-col lg:flex-row flex-1 overflow-hidden min-h-0">
              {/* Video Player - maintains 16:9 aspect ratio, centered */}
              <div className="flex-1 bg-black flex items-center justify-center p-2 md:p-4 min-h-0 overflow-hidden">
                <div className="w-full max-w-4xl mx-auto" style={{ aspectRatio: '16/9', maxHeight: '100%' }}>
                  {selectedCourse.videos?.[currentIndex]?.url ? (
                    <VideoPlayer
                      videoUrl={selectedCourse.videos[currentIndex].url}
                      videoTitle={selectedCourse.videos[currentIndex].title}
                      onEnded={handleEnded}
                    />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                      <PlayCircle className="w-16 h-16 mx-auto mb-2" />
                      <p>No video available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Playlist - fixed width on desktop, bottom on mobile */}
              {selectedCourse.videos?.length > 0 && (
                <div className="w-full lg:w-80 bg-gray-800 overflow-y-auto flex-shrink-0 lg:h-full max-h-40 lg:max-h-full">
                  <div className="p-3 border-b border-gray-700 flex items-center gap-2">
                    <ListVideo className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-400 font-medium">Course Content</p>
                  </div>
                  <div className="p-2 space-y-1">
                    {selectedCourse.videos.map((video, index) => (
                      <button
                        key={index}
                        onClick={() => changeVideo(index)}
                        className={`w-full text-left p-3 rounded-lg transition flex items-center gap-3 ${
                          currentIndex === index
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        <PlayCircle className={`w-4 h-4 flex-shrink-0 ${currentIndex === index ? 'text-white' : 'text-gray-500'}`} />
                        <span className="text-sm truncate">{video.title || `Video ${index + 1}`}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EnrolledCourses