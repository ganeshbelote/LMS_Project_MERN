import Course from '../models/course.model.js'
import User from '../models/user.model.js'
import processAndUploadVideo from "../utils/cloudinary.js"
import cloudinary from '../config/cloudinary.js';

export const addCourse = async (req, res) => {
  try {
    const { title, description, price, videoUrls, videoTitles } = req.body;

    // Validate required fields
    if (!title || !description || !price) {
      return res.status(400).json({
        ok: false,
        message: 'Title, description, and price are required!',
        details: { title: !!title, description: !!description, price: !!price }
      });
    }

    let thumbnailUrl = '';

    // Handle thumbnail - either file upload or URL
    if (req.files && req.files.thumbnail) {
      try {
        const thumbnailUpload = await cloudinary.uploader.upload(
          req.files.thumbnail[0].path,
          { folder: 'courses/thumbnails', resource_type: 'image' }
        );
        thumbnailUrl = thumbnailUpload.secure_url;
      } catch (uploadErr) {
        console.error('Thumbnail upload error:', uploadErr);
        return res.status(500).json({
          ok: false,
          message: 'Failed to upload thumbnail image!',
          error: uploadErr.message
        });
      }
    } else {
      return res.status(400).json({
        ok: false,
        message: 'Thumbnail image is required!'
      });
    }

    // Build videos array from URLs or file uploads
    let videos = [];

    // Case 1: Video URLs provided (from frontend form)
    if (videoUrls) {
      const urlArr = Array.isArray(videoUrls) ? videoUrls : [videoUrls];
      const titleArr = videoTitles
        ? (Array.isArray(videoTitles) ? videoTitles : [videoTitles])
        : [];

      videos = urlArr.map((url, index) => ({
        title: titleArr[index] || `Lecture ${index + 1}`,
        url: url,
        public_id: url // Store URL as public_id for URL-based videos
      }));
    }

    // Case 2: Video files uploaded (legacy support)
    if (req.files && req.files.videos && req.files.videos.length > 0) {
      const videoTitlesArr = videoTitles
        ? (Array.isArray(videoTitles) ? videoTitles : [videoTitles])
        : [];

      const uploadedVideos = await Promise.all(
        req.files.videos.map(async (file, index) => {
          try {
            const uploadResult = await processAndUploadVideo(file.path, 'courses/videos');
            return {
              title: videoTitlesArr[index] || 'Untitled',
              url: uploadResult.url,
              public_id: uploadResult.public_id,
            };
          } catch (videoErr) {
            console.error(`Video upload error at index ${index}:`, videoErr);
            return {
              title: videoTitlesArr[index] || 'Untitled',
              url: '',
              public_id: 'upload_failed'
            };
          }
        })
      );
      videos = [...videos, ...uploadedVideos];
    }

    if (videos.length === 0) {
      return res.status(400).json({
        ok: false,
        message: 'At least one video URL or file is required!'
      });
    }

    const newCourse = new Course({
      title,
      description,
      price: Number(price),
      thumbnail: thumbnailUrl,
      videos,
    });

    await newCourse.save();

    console.log(`✅ Course created: ${newCourse.title} (${newCourse._id})`);

    return res.status(200).json({
      ok: true,
      message: 'Course added successfully!',
      course: {
        id: newCourse._id,
        title: newCourse.title,
        description: newCourse.description,
        price: newCourse.price,
        thumbnail: newCourse.thumbnail,
        videosCount: newCourse.videos.length
      },
    });
  } catch (error) {
    console.error('❌ Error in addCourse:', error);
    console.error('Stack:', error.stack);
    return res.status(500).json({
      ok: false,
      message: 'Failed to add course. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id || req.body.id;
    const { title, description, price, videoUrls, videoTitles } = req.body;

    if (!courseId) {
      return res.status(400).json({
        ok: false,
        message: 'Course ID is required!'
      });
    }

    const existingCourse = await Course.findById(courseId);
    if (!existingCourse) {
      return res.status(404).json({
        ok: false,
        message: 'Course not found!'
      });
    }

    // Update fields if provided
    if (title) existingCourse.title = title;
    if (description) existingCourse.description = description;
    if (price) existingCourse.price = Number(price);

    // Handle thumbnail update
    if (req.files && req.files.thumbnail) {
      try {
        const thumbnailUpload = await cloudinary.uploader.upload(
          req.files.thumbnail[0].path,
          { folder: 'courses/thumbnails', resource_type: 'image' }
        );
        existingCourse.thumbnail = thumbnailUpload.secure_url;
      } catch (uploadErr) {
        console.error('Thumbnail upload error:', uploadErr);
        return res.status(500).json({
          ok: false,
          message: 'Failed to upload thumbnail image!',
          error: uploadErr.message
        });
      }
    }

    // Handle video URLs update
    if (videoUrls) {
      const urlArr = Array.isArray(videoUrls) ? videoUrls : [videoUrls];
      const titleArr = videoTitles
        ? (Array.isArray(videoTitles) ? videoTitles : [videoTitles])
        : [];

      existingCourse.videos = urlArr.map((url, index) => ({
        title: titleArr[index] || `Lecture ${index + 1}`,
        url: url,
        public_id: url
      }));
    }

    await existingCourse.save();

    console.log(`✅ Course updated: ${existingCourse.title} (${existingCourse._id})`);

    return res.status(200).json({
      ok: true,
      message: 'Course updated successfully!',
      course: existingCourse
    });
  } catch (error) {
    console.error('❌ Error in updateCourse:', error);
    console.error('Stack:', error.stack);
    return res.status(500).json({
      ok: false,
      message: 'Failed to update course. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const courseId = req.body.id || req.params.id;

    if (!courseId) {
      return res.status(400).json({
        ok: false,
        message: 'Course ID is required!'
      });
    }

    const course = await Course.findByIdAndDelete(courseId);

    if (!course) {
      return res.status(404).json({
        ok: false,
        message: 'Course not found!'
      });
    }

    console.log(`✅ Course deleted: ${courseId}`);

    return res.status(200).json({
      ok: true,
      message: 'Course deleted successfully!'
    });
  } catch (error) {
    console.error('❌ Error deleting course:', error);
    return res.status(500).json({
      ok: false,
      message: 'Failed to delete course!'
    });
  }
};

export const getAllCourses = async (_, res) => {
  try {
    const data = await Course.find().sort({ createdAt: -1 });

    return res.status(200).json({
      ok: true,
      message: 'All courses fetched successfully!',
      data
    });
  } catch (error) {
    console.error('❌ Error fetching courses:', error);
    return res.status(500).json({
      ok: false,
      message: 'Failed to fetch courses!'
    });
  }
};

export const getCourseDetail = async (req, res) => {
  try {
    const courseId = req.body.id || req.params.id;

    if (!courseId) {
      return res.status(400).json({
        ok: false,
        message: 'Course ID is required!'
      });
    }

    const courseDetail = await Course.findById(courseId);

    if (!courseDetail) {
      return res.status(404).json({
        ok: false,
        message: 'Course not found!'
      });
    }

    return res.status(200).json({
      ok: true,
      message: 'Course details fetched successfully!',
      data: courseDetail
    });
  } catch (error) {
    console.error('❌ Error fetching course detail:', error);
    return res.status(500).json({
      ok: false,
      message: 'Failed to fetch course details!'
    });
  }
};

export const enrollCourse = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    if (!userId || !courseId) {
      return res.status(400).json({
        ok: false,
        message: 'User ID and Course ID are required!'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'User not found!'
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        ok: false,
        message: 'Course not found!'
      });
    }

    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({
        ok: false,
        message: 'You are already enrolled in this course!',
        exist: true
      });
    }

    user.enrolledCourses.push(courseId);
    await user.save();

    console.log(`✅ User ${user.username} enrolled in course ${course.title}`);

    return res.status(200).json({
      ok: true,
      message: 'Successfully enrolled in course!'
    });
  } catch (error) {
    console.error('❌ Error enrolling course:', error);
    return res.status(500).json({
      ok: false,
      message: 'Failed to enroll. Please try again!'
    });
  }
};

export const cancelEnroll = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    if (!userId || !courseId) {
      return res.status(400).json({
        ok: false,
        message: 'User ID and Course ID are required!'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'User not found!'
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        ok: false,
        message: 'Course not found!'
      });
    }

    if (!user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({
        ok: false,
        message: "You aren't enrolled in this course!",
        exist: true
      });
    }

    user.enrolledCourses = user.enrolledCourses.filter(
      id => id.toString() !== courseId
    );
    await user.save();

    return res.status(200).json({
      ok: true,
      message: 'Course enrollment cancelled successfully!'
    });
  } catch (error) {
    console.error('❌ Error cancelling enrollment:', error);
    return res.status(500).json({
      ok: false,
      message: 'Failed to cancel enrollment!'
    });
  }
};

export const checkEnrollment = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    if (!userId || !courseId) {
      return res.status(400).json({
        ok: false,
        message: 'User ID and Course ID are required!'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'User not found!'
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        ok: false,
        message: 'Course not found!'
      });
    }

    const isEnrolled = user.enrolledCourses.includes(courseId);

    return res.status(200).json({
      isEnrolled,
      message: isEnrolled ? 'User is enrolled' : 'User is not enrolled'
    });
  } catch (error) {
    console.error('❌ Error checking enrollment:', error);
    return res.status(500).json({
      ok: false,
      message: 'Failed to check enrollment!'
    });
  }
};

export const getAllEnrollments = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        ok: false,
        message: 'User ID is required!'
      });
    }

    const user = await User.findById(userId).populate('enrolledCourses');

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'User not found!'
      });
    }

    return res.status(200).json({
      ok: true,
      message: 'Enrolled courses fetched successfully!',
      data: user.enrolledCourses
    });
  } catch (error) {
    console.error('❌ Error fetching enrollments:', error);
    return res.status(500).json({
      ok: false,
      message: 'Failed to fetch enrolled courses!'
    });
  }
};