import React, { useEffect, useRef, useState } from 'react'
import courseBg from '../assets/coursesbg.png'
import ReactPlayer from 'react-player'
import baseUrl from '../utils/baseUrl'

const EnrolledCourses = () => {
  const userId = localStorage.getItem('id')
  const [enrollments, setEnrollments] = useState([])
  const [videoList, setVideoList] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [display, setDisplay] = useState(false)
  const playerRef = useRef(null)

  const handleClick = i => {
    setVideoList(enrollments[i].videos)
    setDisplay(prev => !prev)
  }

  // Function to change video
  const changeVideo = index => {
    setCurrentIndex(index)
  }

  // Auto-play next video when current ends
  const handleEnded = () => {
    if (currentIndex < videoList.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  useEffect(() => {
    const url = `${baseUrl}/api/v1/courses/getAllEnrollments`
    const fetchEnrollments = async () => {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })

      const result = await res.json()
      setEnrollments(result.data)
    }
    fetchEnrollments()
  }, [])

  return (
    <div
      className='dashboard w-[100vw] lg:w-[80vw] absolute right-0 '
    >
      <div className='heading p-4 w-full bg-[#0d121c] shadow-2xl shadow-white text-white flex items-center justify-center'>
        <h2
          className='bg-zinc-900  rounded-4xl text-center lg:text-2xl font-bold shadow-2xs shadow-amber-50'
          style={{
            padding: '10px 20px'
          }}
        >
          Enrolled Courses
        </h2>
      </div>
      <div
        className='courses relative w-full min-h-[100vh] flex justify-center flex-wrap gap-5'
        style={{
          padding: '10vh',
          backgroundImage: `url(${courseBg})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {enrollments.map((enrollment, i) => (
          <div key={i}>
            <div
              className='course p-4 min-w-3xs text-white bg-[#1c263c] rounded-lg shadow-lg shadow-black hover:scale-101 hover:transition-all flex flex-col items-center justify-center gap-3 relative'
              onClick={() => handleClick(i)}
            >
              <div
                className='thumbnail h-36 w-full rounded-lg'
                style={{
                  backgroundImage: `url(${enrollment.thumbnail})`,
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center'
                }}
              ></div>
              <h2 className='text-2xl font-bold'>{enrollment.title}</h2>
              <p className='text-xl font-semibold text-zinc-500 text-center'>
                {enrollment.description.slice(0, 20) + '...'}
              </p>
              <h2 className='text-2xl text-green-700 font-bold'>
                {enrollment.price} Rs.
              </h2>
              <button
                className='bg-green-600 text-white text-lg font-semibold font rounded-lg cursor-pointer hover:scale-105'
                style={{ padding: '8px 10px' }}
              >
                Enrolled
              </button>
            </div>
            {display ? (
              <div className='h-screen w-full absolute top-0 left-0 bg-[#00000080] flex items-center justify-center'>
                <div className='player p-3 relative h-[85%] w-[90%] rounded-2xl bg-black flex flex-col lg:flex-row items-center justify-center gap-5'>
                  <div className='video p-3 overflow-hidden h-[90%] w-full lg:w-[60%] flex flex-col gap-2 items-center justify-center'>
                    <h2 className='text-white text-3xl font-bold'>
                      {videoList[currentIndex].title}
                    </h2>
                    <ReactPlayer
                      ref={playerRef}
                      url={`${videoList[
                        currentIndex
                      ].url}`}
                      controls
                      width='100%'
                      height='90%'
                      playing={true}
                      onEnded={handleEnded}
                    />
                  </div>
                  <div className='videos min-h-[50%] max-h-[90%] w-full lg:w-[30%] flex flex-col items-center justify-evenly rounded-2xl border-2 border-zinc-600 bg-[#121928]'>
                    <div className='flex flex-col' style={{ marginTop: '10px' }}>
                      {videoList.map((video, index) => (
                        <button
                          key={index}
                          onClick={() => changeVideo(index)}
                          style={{
                            margin: '5px',
                            padding: '10px 20px',
                            cursor: 'pointer',
                            backgroundColor:
                              currentIndex === index ? 'blue' : 'gray',
                            color: 'white',
                            border: 'none'
                          }}
                          className='rounded-2xl text-lg font-semibold'
                        >
                          {video.title}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button className='absolute top-5 right-10 text-white font-bold flex items-center justify-center cursor-pointer h-6 w-6 bg-red-700 rounded-full'
                  onClick={()=>setDisplay(prev => !prev)}
                  >X</button>
                </div>
              </div>
            ) : (
              ''
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default EnrolledCourses
