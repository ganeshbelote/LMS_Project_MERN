import React, { useEffect, useState } from 'react'
import courseDetailBg from '../assets/courseDetailBg.png'
import { useNavigate, useParams } from 'react-router-dom'
import { failureMsg, successMsg } from '../utils/message'
import { ToastContainer } from 'react-toastify'

const CourseDetail = () => {
  const navigate = useNavigate()
  const [role, setRole] = useState(null)
  const { courseId } = useParams()
  const [courseDetails, setCourseDetails] = useState({})
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [loadingEnroll, setLoadingEnroll] = useState(false)
  const userId = localStorage.getItem('id')
  useEffect(() => {
    const role = localStorage.getItem('role')
    setRole(role)
  }, [])
  useEffect(() => {
    // Fetch course details
    const fetchCourseDetails = async () => {
      const url = `http://localhost:8000/api/v1/courses/courseDetails`
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: courseId })
        })
        const courseData = await res.json()
        setCourseDetails(courseData.data)
      } catch (err) {
        console.error('Failed to fetch course details', err)
      }
    }

    // Check if the user is enrolled in this course
    const checkEnrollment = async () => {
      const url = 'http://localhost:8000/api/v1/courses/checkEnrollment'
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, courseId })
        })
        const data = await res.json()
        // Assume the API returns an object like { isEnrolled: true }.
        setIsEnrolled(data.isEnrolled)
      } catch (err) {
        console.error('Failed to check enrollment', err)
      }
    }

    fetchCourseDetails()
    if (userId && courseId) {
      checkEnrollment()
    }
  }, [courseId, userId])

  // Toggle enrollment status on button click
  const handleEnroll = async () => {
    if (loadingEnroll) return // prevent multiple clicks
    setLoadingEnroll(true)

    if (!isEnrolled) {
      // Enroll in the course
      const url = 'http://localhost:8000/api/v1/courses/enrollCourse'
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, courseId })
        })
        const result = await res.json()
        successMsg(result.message)
        setIsEnrolled(true)
      } catch (err) {
        console.error('Enrollment failed', err)
      }
    } else {
      // Cancel enrollment
      const url = 'http://localhost:8000/api/v1/courses/cancleEnroll'
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, courseId })
        })
        const result = await res.json()
        failureMsg(result.message)
        setIsEnrolled(false)
      } catch (err) {
        failureMsg('Cancel enrollment failed', err)
      }
    }
    setLoadingEnroll(false)
  }

  const handleNavigate = () => {
    navigate(role === 'user' ? '/Home/dashboard' : '/Admin/dashboard')
  }

  return (
    <div className='h-screen text-white'>
      <div className='h-full w-full bg-[#0000008b] flex items-center justify-center'>
        <div className='relative p-8 lg:py-12 lg:px-22 h-[90%] w-[90%] flex flex-col-reverse gap-3 lg:gap-0 lg:flex-row items-center justify-between bg-[#121928] rounded-xl shadow-xl shadow-black'>
          <div className='h-[90%] w-full lg:w-[45%] flex flex-col items-start justify-center gap-2.5 lg:gap-4.5 rounded-xl'>
            <h2 className='rounded-lg text-xl lg:text-3xl font-bold'>
              {courseDetails.title}
            </h2>
            <p
              className='min-h-[50%] w-full rounded-lg lg:text-xl bg-zinc-800 text-zinc-600 font-semibold overflow-y-scroll'
              style={{ padding: '2vw' }}
            >
              <i>{courseDetails.description}</i>
            </p>
            <h2 className='rounded-lg lg:text-2xl font-bold text-green-600'>
              <i>{courseDetails.price} Rs.</i>
            </h2>
            {role == 'user' ? (
              <button
                className={`${
                  isEnrolled ? 'bg-green-600' : 'bg-blue-600'
                } text-white text-lg font-semibold rounded-lg cursor-pointer hover:scale-105`}
                style={{ padding: '8px 10px'}}
                onClick={handleEnroll}
                disabled={loadingEnroll}
              >
                {loadingEnroll
                  ? isEnrolled
                    ? 'Canceling enrollment ...'
                    : 'Enrolling ...'
                  : isEnrolled
                  ? 'Enrolled'
                  : 'Enroll Now'}
              </button>
            ) : (
              ''
            )}
          </div>
          <div
            className='h-[70%] w-full lg:w-[45%] rounded-xl shadow-zinc-500 shadow-md'
            style={{
              backgroundImage: `url(http://localhost:8000/${
                courseDetails.thumbnail?.split('\\').pop() || ''
              })`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat'
            }}
          ></div>
          <div
            className='absolute font-bold top-5 right-5 bg-red-700 rounded-4xl cursor-pointer'
            style={{ padding: '2px 10px 4px' }}
            onClick={handleNavigate}
          >
            X
          </div>
        </div>
      </div>
      <ToastContainer position='top-right' autoClose={3000} />
    </div>
  )
}

export default CourseDetail
