import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import baseUrl from '../utils/baseUrl'
import { toast } from 'react-toastify'
import { Plus, Upload, Image, Trash2, Link as LinkIcon, AlertCircle, Info, CheckCircle, ArrowLeft, Loader } from 'lucide-react'

const EditCourse = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { role } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fetchError, setFetchError] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    thumbnail: null,
    thumbnailPreview: null,
    lectures: [{ videoUrl: '', videoTitle: '' }]
  })
  const [formKey, setFormKey] = useState(0)
  const [errors, setErrors] = useState({})

  const isAdmin = role?.toLowerCase() === 'admin'

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.post('/courses/courseDetails', { id: courseId })
        if (res.data.ok) {
          const course = res.data.data
          setFormData({
            title: course.title || '',
            description: course.description || '',
            price: course.price?.toString() || '',
            thumbnail: null,
            thumbnailPreview: course.thumbnail || null,
            lectures: course.videos?.length > 0 
              ? course.videos.map(v => ({ videoUrl: v.url || '', videoTitle: v.title || '' }))
              : [{ videoUrl: '', videoTitle: '' }]
          })
        } else {
          setFetchError('Course not found')
        }
      } catch (err) {
        setFetchError('Failed to load course data')
      } finally {
        setLoading(false)
      }
    }
    fetchCourse()
  }, [courseId])

  // Redirect non-admins
  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/')
    }
  }, [loading, isAdmin, navigate])

  const handleThumbnailChange = e => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Thumbnail image must be under 5MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file')
        return
      }
      const previewUrl = URL.createObjectURL(file)
      setFormData({ ...formData, thumbnail: file, thumbnailPreview: previewUrl })
      setErrors(prev => ({ ...prev, thumbnail: '' }))
    }
  }

  const removeThumbnail = () => {
    if (formData.thumbnailPreview) {
      URL.revokeObjectURL(formData.thumbnailPreview)
    }
    setFormData({ ...formData, thumbnail: null, thumbnailPreview: null })
  }

  const handleVideoUrlChange = (index, e) => {
    const updatedLectures = [...formData.lectures]
    updatedLectures[index].videoUrl = e.target.value
    setFormData({ ...formData, lectures: updatedLectures })
    setErrors(prev => ({ ...prev, [`video_${index}`]: '' }))
  }

  const handleTitleChange = (index, e) => {
    const updatedLectures = [...formData.lectures]
    updatedLectures[index].videoTitle = e.target.value
    setFormData({ ...formData, lectures: updatedLectures })
    setErrors(prev => ({ ...prev, [`title_${index}`]: '' }))
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

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = 'Course title is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'Valid price is required'

    formData.lectures.forEach((l, i) => {
      if (l.videoUrl && !l.videoUrl.startsWith('http://') && !l.videoUrl.startsWith('https://')) {
        newErrors[`video_${i}`] = 'URL must start with http:// or https://'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async e => {
    e.preventDefault()
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting')
      return
    }

    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const data = new FormData()
      data.append('id', courseId)
      data.append('title', formData.title.trim())
      data.append('description', formData.description.trim())
      data.append('price', formData.price)
      data.append('token', token)

      if (formData.thumbnail) {
        data.append('thumbnail', formData.thumbnail)
      }

      const validLectures = formData.lectures.filter(l => l.videoUrl?.trim() && l.videoTitle?.trim())
      validLectures.forEach(lecture => {
        data.append('videoUrls', lecture.videoUrl.trim())
        data.append('videoTitles', lecture.videoTitle.trim())
      })

      console.log('📤 Updating course:', courseId)

      const response = await fetch(`${baseUrl}/courses/updateCourse/${courseId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: data
      })

      const result = await response.json()

      if (response.ok && result.ok) {
        toast.success('✅ Course updated successfully!')
        navigate(`/course/${courseId}`)
      } else {
        console.error('❌ Update error:', result)
        toast.error(result.message || 'Failed to update course')
      }
    } catch (err) {
      console.error('❌ Update error:', err)
      toast.error('Network error! Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (formData.thumbnailPreview && formData.thumbnail) {
        URL.revokeObjectURL(formData.thumbnailPreview)
      }
    }
  }, [])

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-500 mb-4">{fetchError}</p>
          <button onClick={() => navigate(-1)} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Go Back
          </button>
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
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Edit Course</h2>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Course Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Title *</label>
            <input
              type='text'
              placeholder='e.g. Advanced React Patterns'
              value={formData.title}
              onChange={e => { setFormData({ ...formData, title: e.target.value }); setErrors(prev => ({ ...prev, title: '' })) }}
              className={`w-full px-4 py-3 border rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all ${errors.title ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              required
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              placeholder='Describe what students will learn...'
              value={formData.description}
              onChange={e => { setFormData({ ...formData, description: e.target.value }); setErrors(prev => ({ ...prev, description: '' })) }}
              rows={4}
              className={`w-full px-4 py-3 border rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none ${errors.description ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              required
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
            <input
              type='number'
              min="0"
              step="1"
              placeholder='e.g. 499'
              value={formData.price}
              onChange={e => { setFormData({ ...formData, price: e.target.value }); setErrors(prev => ({ ...prev, price: '' })) }}
              className={`w-full px-4 py-3 border rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all ${errors.price ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              required
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail Image</label>
            {formData.thumbnailPreview ? (
              <div className="relative rounded-xl overflow-hidden border-2 border-green-400 bg-green-50">
                <img src={formData.thumbnailPreview} alt="Thumbnail" className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="flex gap-3">
                    <label htmlFor='thumbnail' className="cursor-pointer bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition">
                      Change
                    </label>
                    <button type="button" onClick={removeThumbnail} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition">
                      Remove
                    </button>
                  </div>
                </div>
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> {formData.thumbnail ? 'New image' : 'Current image'}
                </div>
                <input key={`thumb-${formKey}`} id='thumbnail' type='file' accept='image/*' onChange={handleThumbnailChange} className='hidden' />
              </div>
            ) : (
              <div className={`border-2 border-dashed rounded-xl p-6 text-center hover:border-blue-500 transition cursor-pointer ${errors.thumbnail ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}>
                <input key={`thumb-${formKey}`} id='thumbnail' type='file' accept='image/*' onChange={handleThumbnailChange} className='hidden' />
                <label htmlFor='thumbnail' className='cursor-pointer'>
                  <Image className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 font-medium">Click to upload thumbnail</p>
                  <p className="text-xs text-gray-400 mt-1">Max 5MB • JPG, PNG, WebP</p>
                </label>
              </div>
            )}
          </div>

          {/* Video Lectures */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">Video Lectures</label>
              <button type='button' onClick={addLectureField} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
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
                      <input type='url' placeholder='Video URL' value={lecture.videoUrl} onChange={e => handleVideoUrlChange(index, e)}
                        className={`w-full px-4 py-2.5 border rounded-xl text-sm ${errors[`video_${index}`] ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} />
                    </div>
                    {errors[`video_${index}`] && <p className="text-red-500 text-xs">{errors[`video_${index}`]}</p>}
                    <input type='text' placeholder='Video title' value={lecture.videoTitle} onChange={e => handleTitleChange(index, e)}
                      className='w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm' />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type='submit'
              disabled={saving}
              className="flex-1 bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <><Loader className="w-5 h-5 animate-spin" /> Saving...</>
              ) : (
                <><Upload className="w-5 h-5" /> Save Changes</>
              )}
            </motion.button>
            <button
              type='button'
              onClick={() => navigate(-1)}
              className="px-6 py-3.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default EditCourse