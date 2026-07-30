import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import baseUrl from '../utils/baseUrl'
import { toast } from 'react-toastify'
import { Plus, Upload, Film, Image, Trash2, Link as LinkIcon } from 'lucide-react'

const AddCourses = () => {
  const { role } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    thumbnail: null,
    lectures: [{ videoUrl: '', videoTitle: '' }]
  })
  const [formKey, setFormKey] = useState(0)

  const handleThumbnailChange = e => {
    setFormData({ ...formData, thumbnail: e.target.files[0] })
  }

  const handleVideoUrlChange = (index, e) => {
    const updatedLectures = [...formData.lectures]
    updatedLectures[index].videoUrl = e.target.value
    setFormData({ ...formData, lectures: updatedLectures })
  }

  const handleTitleChange = (index, e) => {
    const updatedLectures = [...formData.lectures]
    updatedLectures[index].videoTitle = e.target.value
    setFormData({ ...formData, lectures: updatedLectures })
  }

  const addLectureField = () => {
    setFormData({
      ...formData,
      lectures: [...formData.lectures, { videoUrl: '', videoTitle: '' }]
    })
  }

  const removeLecture = (index) => {
    if (formData.lectures.length <= 1) return
    const updatedLectures = formData.lectures.filter((_, i) => i !== index)
    setFormData({ ...formData, lectures: updatedLectures })
  }

  const handleUpload = async e => {
    e.preventDefault()
    if (!formData.title || !formData.description || !formData.price) {
      toast.error('Please fill all required fields')
      return
    }

    const validLectures = formData.lectures.filter(l => l.videoUrl && l.videoTitle)
    if (validLectures.length === 0) {
      toast.error('Add at least one video with a URL and title')
      return
    }

    setLoading(true)

    try {
      const data = new FormData()
      data.append('title', formData.title)
      data.append('description', formData.description)
      data.append('price', formData.price)
      data.append('token', localStorage.getItem('token'))

      if (formData.thumbnail) {
        data.append('thumbnail', formData.thumbnail)
      } else {
        toast.error('Please upload a thumbnail image')
        setLoading(false)
        return
      }

      // For backend compatibility, we still send videos as files if available
      // but primarily use the new JSON endpoint if the file upload fails
      formData.lectures.forEach(lecture => {
        if (lecture.videoUrl && lecture.videoTitle) {
          data.append('videoUrls', lecture.videoUrl)
          data.append('videoTitles', lecture.videoTitle)
        }
      })

      const response = await fetch(`${baseUrl}/courses/`, {
        method: 'POST',
        headers: {
          Authorization: localStorage.getItem('token')
        },
        body: data
      })

      const result = await response.json()
      if (response.ok) {
        toast.success('Course added successfully!')
        setFormData({
          title: '',
          description: '',
          price: '',
          thumbnail: null,
          lectures: [{ videoUrl: '', videoTitle: '' }]
        })
        setFormKey(prev => prev + 1)
      } else {
        toast.error(result.message || 'Upload failed')
      }
    } catch (err) {
      toast.error('Upload failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (role !== 'Admin') {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-500">Only admins can add courses</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Course</h2>
        
        <form onSubmit={handleUpload} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Title *</label>
            <input
              type='text'
              placeholder='e.g. Advanced React Patterns'
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all'
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              placeholder='Describe what students will learn...'
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none'
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
            <input
              type='number'
              placeholder='e.g. 499'
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: e.target.value })}
              className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all'
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail Image *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition cursor-pointer">
              <input
                key={`thumbnail-${formKey}`}
                id='thumbnail'
                type='file'
                accept='image/*'
                onChange={handleThumbnailChange}
                className='hidden'
                required
              />
              <label htmlFor='thumbnail' className='cursor-pointer'>
                <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Click to upload thumbnail image</p>
              </label>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">Video Lectures *</label>
              <button
                type='button'
                onClick={addLectureField}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus className="w-4 h-4" /> Add Lecture
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.lectures.map((lecture, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Lecture {index + 1}</span>
                    {formData.lectures.length > 1 && (
                      <button type='button' onClick={() => removeLecture(index)} className="text-red-500 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <LinkIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <input
                        type='url'
                        placeholder='Video URL (e.g. https://example.com/video.mp4)'
                        value={lecture.videoUrl}
                        onChange={e => handleVideoUrlChange(index, e)}
                        className='w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm'
                        required
                      />
                    </div>
                    <input
                      type='text'
                      placeholder='Video title (e.g. Introduction)'
                      value={lecture.videoTitle}
                      onChange={e => handleTitleChange(index, e)}
                      className='w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm'
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Enter direct video URLs (MP4, WebM, etc.) or hosted video links
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type='submit'
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                Adding Course...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" /> Add Course
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}

export default AddCourses