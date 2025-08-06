import Course from '../models/course.model.js'
import User from '../models/user.model.js'
import processAndUploadVideo from "../utils/cloudinary.js"
import cloudinary from '../config/cloudinary.js';

export const addCourse = async (req, res) => {
  try {
    const { title, description, price, videoTitles } = req.body;

    if (!req.files || !req.files.thumbnail || !req.files.videos) {
      return res.status(400).json({ message: 'Missing files' });
    }

    const videoTitlesArr = Array.isArray(videoTitles) ? videoTitles : [videoTitles];

    const thumbnailUpload = await cloudinary.uploader.upload(
      req.files.thumbnail[0].path,
      {
        folder: 'courses/thumbnails',
        resource_type: 'image',
      }
    );
    const thumbnailUrl = thumbnailUpload.secure_url;

    const uploadedVideos = await Promise.all(
      req.files.videos.map(async (file, index) => {
        const uploadResult = await processAndUploadVideo(file.path, 'courses/videos');
        return {
          title: videoTitlesArr[index] || 'Untitled',
          url: uploadResult.url,
          public_id: uploadResult.public_id,
        };
      })
    );

    const newCourse = new Course({
      title,
      description,
      price,
      thumbnail: thumbnailUrl,
      videos: uploadedVideos,
    });

    await newCourse.save();

    res.status(200).json({
      ok: true,
      message: 'Data uploaded successfully',
      course: newCourse,
    });
  } catch (error) {
    console.error('Error in addCourse:', error);
    res.status(500).json({
      ok: false,
      message: 'Upload failed!',
      error: error.message,
    });
  }
};

export const deleteCourse = async (req, res) => {
  const courseId = req.body.id

  if(!courseId){
    return res.status(404).json({
      ok: false,
      message: 'Invalid Course Id !'
    })
  }

  const course = await Course.findByIdAndDelete(courseId)

  if(!course){
    return res.status(404).json({
      ok: false,
      message: 'Course Not Found !'
    })
  }

  return res.status(200).json({
    ok: true,
    message: 'Course Deleted Successfully !'
  })
}

export const getAllCourses = async (_, res) => {
  try {
    const data = await Course.find()

    if (!data) {
      return res.status(500).json({
        ok: false,
        message: 'Failed to retrive course data !'
      })
    }

    return res.status(200).json({
      ok: true,
      message: 'All course data fetched successfully !',
      data
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Failed to retrive course data !'
    })
  }
}

export const getCourseDetail = async (req, res) => {
  try {
    const courseId = req.body.id

    if (!courseId) {
      return res.status(400).json({
        ok: false,
        message: 'Course Id request error !'
      })
    }

    const courseDetail = await Course.findById(courseId)

    if (!courseDetail) {
      return res.status(400).json({
        ok: false,
        message: 'Course Details not found !'
      })
    }

    return res.status(200).json({
      ok: true,
      message: 'Course Details Fetched successfully !',
      data: courseDetail
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Invalid error !'
    })
  }
}

export const enrollCourse = async(req, res) =>{
  try {
    const { userId , courseId } = req.body
  
    if (!userId || !courseId) {
      return res.status(400)
      .json({
        ok:false,
        message:"Something went wrong Please try again !"
      })
    }
  

    const user = await User.findById(userId)
    if (!user) {
      return res.status(400)
      .json({
        ok:false,
        message:"User not found Please try again !"
      })
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        ok: false,
        message: "Course not found!",
      });
    }

    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({
        ok: false,
        message: "User is already enrolled in this course!",
        exist:true
      });
    }
  
    user.enrolledCourses.push(courseId);
    await user.save();
  
    return res.status(200)
      .json({
        ok:true,
        message:"Course enrolled successfully !",
      })
  } catch (error) {
    return res.status(500)
    .json({
      ok:false,
      message:"Internal Error while enrolling course !"
    })
  }
}

export const cancleEnroll = async(req, res) =>{
  try {
    const { userId , courseId } = req.body
  
    if (!userId || !courseId) {
      return res.status(400)
      .json({
        ok:false,
        message:"Something went wrong Please try again !"
      })
    }
  

    const user = await User.findById(userId)
    if (!user) {
      return res.status(400)
      .json({
        ok:false,
        message:"User not found Please try again !"
      })
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        ok: false,
        message: "Course not found!",
      });
    }

    if (!user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({
        ok: false,
        message: "User isn't enrolled in this course!",
        exist:true
      });
    }
  
    user.enrolledCourses.pop(courseId);
    await user.save();
  
    return res.status(200)
      .json({
        ok:true,
        message:"Course removed successfully !",
      })
  } catch (error) {
    return res.status(500)
    .json({
      ok:false,
      message:"Internal Error while cancling enrollment of course !"
    })
  }
}

export const checkEnrollment = async(req, res) =>{
  try {
    const { userId , courseId } = req.body
  
    if (!userId || !courseId) {
      return res.status(400)
      .json({
        ok:false,
        message:"Something went wrong Please try again !"
      })
    }
  
    const user = await User.findById(userId)
    if (!user) {
      return res.status(400)
      .json({
        ok:false,
        message:"User not found Please try again !"
      })
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        ok: false,
        message: "Course not found!",
      });
    }

    if (user.enrolledCourses.includes(courseId)) {
      return res.status(200).json({
        isEnrolled: true,
        message: "User is enrolled in this course!",
      });
    }else{
      return res.status(200).json({
        isEnrolled: false,
        message: "User isn't enrolled in this course!",
      });
    }

  } catch (error) {
    return res.status(500)
    .json({
      ok:false,
      message:"Internal Error while checking enrollment of course !"
    })
  }
}

export const getAllEnrollments = async(req, res) =>{
  try {
    const { userId } = req.body
  
    if (!userId) {
      return res.status(400)
        .json({
          ok:false,
          message:"Invalid Access !"
        })
    }
  
    const enrollments = await User.findById(userId).populate("enrolledCourses")
  
    if (!enrollments) {
      return res.status(500)
        .json({
          ok:false,
          message:"Something went wrong while fetching enrolled Courses !"
        })
    }
  
      return res.status(200)
        .json({
          ok:true,
          message:"Enrolled courses fetched successfully !",
          data : enrollments.enrolledCourses
        })
  } catch (error) {   
      return res.status(500)
        .json({
          ok:false,
          message:"Internal Error !"
        })
    }
}