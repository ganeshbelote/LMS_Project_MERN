import Course from '../models/course.model.js'
import User from '../models/user.model.js'
import processAndUploadVideo from '../utils/cloudinary.js'
import cloudinary from '../config/cloudinary.js'
import { success } from '../utils/response.js'
import { NotFoundError, ConflictError, ValidationError, DatabaseError } from '../errors/index.js'
import logger from '../utils/logger.js'

// ---------------------------------------------------------------------------
// addCourse
// ---------------------------------------------------------------------------
export const addCourse = async (req, res) => {
  const { title, description, price, videoUrls, videoTitles } = req.body

  if (!title || !description || !price) {
    throw new ValidationError('Title, description, and price are required!', {
      title: !!title, description: !!description, price: !!price
    })
  }

  let thumbnailUrl = ''

  if (req.files && req.files.thumbnail) {
    try {
      const thumbnailUpload = await cloudinary.uploader.upload(
        req.files.thumbnail[0].path,
        { folder: 'courses/thumbnails', resource_type: 'image' }
      )
      thumbnailUrl = thumbnailUpload.secure_url
    } catch (uploadErr) {
      logger.error({ error: uploadErr }, 'Thumbnail upload error')
      throw new DatabaseError('Failed to upload thumbnail image!', uploadErr.message)
    }
  } else {
    throw new ValidationError('Thumbnail image is required!')
  }

  let videos = []

  if (videoUrls) {
    const urlArr = Array.isArray(videoUrls) ? videoUrls : [videoUrls]
    const titleArr = videoTitles ? (Array.isArray(videoTitles) ? videoTitles : [videoTitles]) : []
    videos = urlArr.map((url, index) => ({
      title: titleArr[index] || `Lecture ${index + 1}`,
      url,
      public_id: url
    }))
  }

  if (req.files && req.files.videos && req.files.videos.length > 0) {
    const videoTitlesArr = videoTitles ? (Array.isArray(videoTitles) ? videoTitles : [videoTitles]) : []
    const uploadedVideos = await Promise.all(
      req.files.videos.map(async (file, index) => {
        try {
          const uploadResult = await processAndUploadVideo(file.path, 'courses/videos')
          return {
            title: videoTitlesArr[index] || 'Untitled',
            url: uploadResult.url,
            public_id: uploadResult.public_id
          }
        } catch (videoErr) {
          logger.error({ error: videoErr, index }, 'Video upload error')
          return { title: videoTitlesArr[index] || 'Untitled', url: '', public_id: 'upload_failed' }
        }
      })
    )
    videos = [...videos, ...uploadedVideos]
  }

  if (videos.length === 0) {
    throw new ValidationError('At least one video URL or file is required!')
  }

  const newCourse = new Course({
    title,
    description,
    price: Number(price),
    thumbnail: thumbnailUrl,
    videos
  })

  await newCourse.save()
  logger.info({ courseId: newCourse._id, title: newCourse.title }, 'Course created')

  return success(res, {
    statusCode: 200,
    message: 'Course added successfully!',
    data: {
      id: newCourse._id,
      title: newCourse.title,
      description: newCourse.description,
      price: newCourse.price,
      thumbnail: newCourse.thumbnail,
      videosCount: newCourse.videos.length
    }
  })
}

// ---------------------------------------------------------------------------
// updateCourse
// ---------------------------------------------------------------------------
export const updateCourse = async (req, res) => {
  const courseId = req.params.id || req.body.id
  const { title, description, price, videoUrls, videoTitles } = req.body

  if (!courseId) {
    throw new ValidationError('Course ID is required!')
  }

  const existingCourse = await Course.findById(courseId)
  if (!existingCourse) {
    throw new NotFoundError('Course not found!')
  }

  if (title) existingCourse.title = title
  if (description) existingCourse.description = description
  if (price) existingCourse.price = Number(price)

  if (req.files && req.files.thumbnail) {
    try {
      const thumbnailUpload = await cloudinary.uploader.upload(
        req.files.thumbnail[0].path,
        { folder: 'courses/thumbnails', resource_type: 'image' }
      )
      existingCourse.thumbnail = thumbnailUpload.secure_url
    } catch (uploadErr) {
      logger.error({ error: uploadErr }, 'Thumbnail upload error')
      throw new DatabaseError('Failed to upload thumbnail image!', uploadErr.message)
    }
  }

  if (videoUrls) {
    const urlArr = Array.isArray(videoUrls) ? videoUrls : [videoUrls]
    const titleArr = videoTitles ? (Array.isArray(videoTitles) ? videoTitles : [videoTitles]) : []
    existingCourse.videos = urlArr.map((url, index) => ({
      title: titleArr[index] || `Lecture ${index + 1}`,
      url,
      public_id: url
    }))
  }

  await existingCourse.save()
  logger.info({ courseId: existingCourse._id, title: existingCourse.title }, 'Course updated')

  return success(res, {
    statusCode: 200,
    message: 'Course updated successfully!',
    data: existingCourse
  })
}

// ---------------------------------------------------------------------------
// deleteCourse
// ---------------------------------------------------------------------------
export const deleteCourse = async (req, res) => {
  const courseId = req.body.id || req.params.id

  if (!courseId) {
    throw new ValidationError('Course ID is required!')
  }

  const course = await Course.findByIdAndDelete(courseId)
  if (!course) {
    throw new NotFoundError('Course not found!')
  }

  logger.info({ courseId }, 'Course deleted')
  return success(res, {
    statusCode: 200,
    message: 'Course deleted successfully!'
  })
}

// ---------------------------------------------------------------------------
// getAllCourses
// ---------------------------------------------------------------------------
export const getAllCourses = async (_req, res) => {
  const data = await Course.find().sort({ createdAt: -1 })

  return success(res, {
    statusCode: 200,
    message: 'All courses fetched successfully!',
    data
  })
}

// ---------------------------------------------------------------------------
// getCourseDetail
// ---------------------------------------------------------------------------
export const getCourseDetail = async (req, res) => {
  const courseId = req.body.id || req.params.id

  if (!courseId) {
    throw new ValidationError('Course ID is required!')
  }

  const courseDetail = await Course.findById(courseId)
  if (!courseDetail) {
    throw new NotFoundError('Course not found!')
  }

  return success(res, {
    statusCode: 200,
    message: 'Course details fetched successfully!',
    data: courseDetail
  })
}

// ---------------------------------------------------------------------------
// enrollCourse
// ---------------------------------------------------------------------------
export const enrollCourse = async (req, res) => {
  const { userId, courseId } = req.body

  const user = await User.findById(userId)
  if (!user) {
    throw new NotFoundError('User not found!')
  }

  const course = await Course.findById(courseId)
  if (!course) {
    throw new NotFoundError('Course not found!')
  }

  if (user.enrolledCourses.includes(courseId)) {
    throw new ConflictError('You are already enrolled in this course!')
  }

  user.enrolledCourses.push(courseId)
  await user.save()

  logger.info({ userId, courseId }, 'User enrolled in course')

  return success(res, {
    statusCode: 200,
    message: 'Successfully enrolled in course!'
  })
}

// ---------------------------------------------------------------------------
// cancelEnroll
// ---------------------------------------------------------------------------
export const cancelEnroll = async (req, res) => {
  const { userId, courseId } = req.body

  const user = await User.findById(userId)
  if (!user) {
    throw new NotFoundError('User not found!')
  }

  const course = await Course.findById(courseId)
  if (!course) {
    throw new NotFoundError('Course not found!')
  }

  if (!user.enrolledCourses.includes(courseId)) {
    throw new ConflictError("You aren't enrolled in this course!")
  }

  user.enrolledCourses = user.enrolledCourses.filter(id => id.toString() !== courseId)
  await user.save()

  return success(res, {
    statusCode: 200,
    message: 'Course enrollment cancelled successfully!'
  })
}

// ---------------------------------------------------------------------------
// checkEnrollment
// ---------------------------------------------------------------------------
export const checkEnrollment = async (req, res) => {
  const { userId, courseId } = req.body

  const user = await User.findById(userId)
  if (!user) {
    throw new NotFoundError('User not found!')
  }

  const course = await Course.findById(courseId)
  if (!course) {
    throw new NotFoundError('Course not found!')
  }

  const isEnrolled = user.enrolledCourses.includes(courseId)

  return success(res, {
    statusCode: 200,
    message: isEnrolled ? 'User is enrolled' : 'User is not enrolled',
    data: { isEnrolled }
  })
}

// ---------------------------------------------------------------------------
// getAllEnrollments
// ---------------------------------------------------------------------------
export const getAllEnrollments = async (req, res) => {
  const { userId } = req.body

  const user = await User.findById(userId).populate('enrolledCourses')
  if (!user) {
    throw new NotFoundError('User not found!')
  }

  return success(res, {
    statusCode: 200,
    message: 'Enrolled courses fetched successfully!',
    data: user.enrolledCourses
  })
}