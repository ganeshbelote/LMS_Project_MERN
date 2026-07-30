import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import baseUrl from '../utils/baseUrl'
import { toast } from 'react-toastify'
import { Plus, Upload, Image, Trash2, Link as LinkIcon, AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react'

const AddCourses = () => {
  const { role, user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
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

  // Redirect non-admins
  const isAdmin = role?.toLowerCase() === 'admin'

  const handleThumbnailChange = e => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Thumbnail image must be under 5MB')
        return
      }
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file')
        return
      }
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setFormData({ 
        ...formData, 
        thumbnail: file,
        thumbnailPreview: previewUrl 
      })
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
    // Clear error for this field
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
    if (!formData.thumbnail) newErrors.thumbnail = 'Thumbnail image is required'

    const validLectures = formData.lectures.filter(l => l.videoUrl?.trim() && l.videoTitle?.trim())
    if (validLectures.length === 0) {
      newErrors.lectures = 'Add at least one video with URL and title'
    }

    // Validate URLs format
    formData.lectures.forEach((l, i) => {
      if (l.videoUrl && !l.videoUrl.startsWith('http://') && !l.videoUrl.startsWith('https://')) {
        newErrors[`video_${i}`] = 'URL must start with http:// or https://'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleUpload = async e => {
    e.preventDefault()
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting')
      return
    }

    setLoading(true)
    setUploadProgress(10)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 80))
    }, 500)

    try {
      const token = localStorage.getItem('token')
      const data = new FormData()
      data.append('title', formData.title.trim())
      data.append('description', formData.description.trim())
      data.append('price', formData.price)
      data.append('token', token)

      if (formData.thumbnail) {
        data.append('thumbnail', formData.thumbnail)
      }

      // Add video URLs and titles
      const validLectures = formData.lectures.filter(l => l.videoUrl?.trim() && l.videoTitle?.trim())
      validLectures.forEach(lecture => {
        data.append('videoUrls', lecture.videoUrl.trim())
        data.append('videoTitles', lecture.videoTitle.trim())
      })

      console.log('📤 Adding course with:', {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        lecturesCount: validLectures.length,
        hasThumbnail: !!formData.thumbnail
      })

      const response = await fetch(`${baseUrl}/courses/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: data
      })

      clearInterval(progressInterval)
      setUploadProgress(90)

      const result = await response.json()

      if (response.ok && result.ok) {
        setUploadProgress(100)
        toast.success('✅ Course added successfully!')
        // Clean up preview URL
        if (formData.thumbnailPreview) {
          URL.revokeObjectURL(formData.thumbnailPreview)
        }
        // Reset form
        setFormData({
          title: '',
          description: '',
          price: '',
          thumbnail: null,
          thumbnailPreview: null,
          lectures: [{ videoUrl: '', videoTitle: '' }]
        })
        setErrors({})
        setFormKey(prev => prev + 1)
        setTimeout(() => setUploadProgress(0), 2000)
      } else {
        console.error('❌ Server error response:', result)
        toast.error(result.message || 'Failed to add course')
        setUploadProgress(0)
      }
    } catch (err) {
      clearInterval(progressInterval)
      console.error('❌ Upload error:', err)
      toast.error('Network error! Please check your connection and try again.')
      setUploadProgress(0)
    } finally {
      setLoading(false)
      setUploadProgress(0)
    }
  }

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (formData.thumbnailPreview) {
        URL.revokeObjectURL(formData.thumbnailPreview)
      }
    }
  }, [])

  // If not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white rounded-2xl shadow-sm border border-gray-100 p-12 max-w-md"
        >
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-6">Only administrators can access this page.</p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
            Your current role: <strong>{role || 'Not set'}</strong>
          </div>
        </motion.div>
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

        {/* Upload Progress Bar */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Uploading course...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
              />
            </div>
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-5">
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

          {/* Thumbnail with Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail Image *</label>
            
            {formData.thumbnailPreview ? (
              /* Show preview when image is selected */
              <div className="relative rounded-xl overflow-hidden border-2 border-green-400 bg-green-50">
                <img 
                  src={formData.thumbnailPreview} 
                  alt="Thumbnail preview" 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="flex gap-3">
                    <label htmlFor='thumbnail' className="cursor-pointer bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition">
                      Change
                    </label>
                    <button
                      type="button"
                      onClick={removeThumbnail}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Image selected
                </div>
                <input
                  key={`thumbnail-${formKey}`}
                  id='thumbnail'
                  type='file'
                  accept='image/*'
                  onChange={handleThumbnailChange}
                  className='hidden'
                />
              </div>
            ) : (
              /* Show upload area when no image */
              <div className={`border-2 border-dashed rounded-xl p-6 text-center hover:border-blue-500 transition cursor-pointer ${errors.thumbnail ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}>
                <input
                  key={`thumbnail-${formKey}`}
                  id='thumbnail'
                  type='file'
                  accept='image/*'
                  onChange={handleThumbnailChange}
                  className='hidden'
                />
                <label htmlFor='thumbnail' className='cursor-pointer'>
                  <Image className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 font-medium">Click to upload thumbnail image</p>
                  <p className="text-xs text-gray-400 mt-1">Max 5MB • JPG, PNG, WebP</p>
                </label>
              </div>
            )}
            {errors.thumbnail && <p className="text-red-500 text-xs mt-1">{errors.thumbnail}</p>}
          </div>

          {/* Video Lectures */}
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
                        placeholder='Video URL (YouTube, Google Drive, or direct MP4 link)'
                        value={lecture.videoUrl}
                        onChange={e => handleVideoUrlChange(index, e)}
                        className={`w-full px-4 py-2.5 border rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm ${errors[`video_${index}`] ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                        required
                      />
                    </div>
                    {errors[`video_${index}`] && <p className="text-red-500 text-xs">{errors[`video_${index}`]}</p>}
                    <input
                      type='text'
                      placeholder='Video title (e.g. Introduction to React)'
                      value={lecture.videoTitle}
                      onChange={e => handleTitleChange(index, e)}
                      className='w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm'
                      required
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Video URL Help */}
            <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-700">
                  <p className="font-medium mb-1">Supported video links:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>YouTube: https://youtube.com/watch?v=... or https://youtu.be/...</li>
                    <li>Google Drive: https://drive.google.com/file/d/.../view</li>
                    <li>Direct MP4/WebM: Any direct video file URL</li>
                  </ul>
                </div>
              </div>
            </div>

            {errors.lectures && <p className="text-red-500 text-xs mt-1">{errors.lectures}</p>}
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