import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BgImg from '../assets/dashboardbg.png'
import courseBg from '../assets/coursesbg.png'
import { failureMsg, successMsg } from '../utils/message'
import courseThumbnail from '../assets/19199494.jpg'


const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [courseData, setCourseData] = useState([])
  const navigate = useNavigate()
  const role = localStorage.getItem("role")
  const [track,setTrack] = useState(0)

  const fetchCourseData = async () =>{
    try {
      const url = "http://localhost:8000/api/v1/courses/"
  
      const res =await fetch(url,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
      })   
      const result = await res.json()
      successMsg(result.message)
      if (result.ok) {
        setCourseData(result.data)
      }
    } catch (error) {
      failureMsg(error)
    }
  }   

  useEffect(() => {
    fetchCourseData() 
  }, [])

  const filteredCourses = courseData.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteCourse = async (id) => {
    try {
      const result = await fetch("http://localhost:8000/api/v1/courses/deleteCourse",{
        method:"DELETE",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({id})
      })

      if (result.ok) {
        fetchCourseData() 
        successMsg(result.message)
      }else{
        throw new error
      }
    } catch (error) {
      failureMsg(error.message)
    }
  }

  return (
    <div
      className='dashboard min-h-[100vh] w-[80vw] absolute right-0 '
      style={{
        marginTop: '12vh'
      }}
    >
      <div
        className='hero h-[60vh] w-full text-white flex flex-col items-center justify-center'
        style={{
          backgroundImage: `url(${BgImg})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className='pos flex flex-col items-center gap-20'>
          <div className='text backdrop-blur-xs'>
            <h2 className='heading text-5xl font-bold text-center'>
              Find the Best Courses for You
            </h2>
            <p
              className='text-center text-xl font-semibold text-zinc-300'
              style={{
                marginTop: '15px'
              }}
            >
              Discover, Learn, and Upskill with our wide range of courses
            </p>
          </div>
          <div className='input h-12 w-[70%] rounded-4xl relative overflow-hidden shadow-lg shadow-black'>
            <input
              className='h-full w-full rounded-4xl outline-0 bg-[#1F2937]'
              type='text'
              style={{
                padding: '0 35px'
              }}
              placeholder='Search Courses ...'
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className='absolute right-0 h-full bg-blue-600 cursor-pointer'
              style={{
                padding: '0 18px'
              }}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="heading h-[12vh] w-full bg-[#0d121c] shadow-2xl shadow-white text-white flex items-center justify-center">
              <h2 className='bg-zinc-900  rounded-4xl text-center text-2xl font-bold shadow-2xs shadow-amber-50'
              style={{
                padding:"10px 20px"
              }}
              >Explore Courses</h2>
      </div>
      <div
        className='courses w-full min-h-[100vh] flex justify-center flex-wrap gap-5'
        style={{
          padding: '10vh',
          backgroundImage: `url(${courseBg})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {filteredCourses.map((course,i)=>(<div key={i} className='course text-white h-[52vh] w-[18vw] bg-[#1c263c] rounded-lg shadow-lg shadow-black hover:scale-101 hover:transition-all flex flex-col items-center justify-between gap-2 relative'
        style={{
          padding:"2% 1%"
        }}
        
        >
          {role === "admin"?<div className="absolute top-1 right-1 h-6 w-6 rounded-full bg-red-500 text-black font-bold flex items-center justify-center border-2 border-black cursor-pointer " onClick={()=>handleDeleteCourse(course._id)}>X</div>:""}
          <div className="thumbnail h-[50%] w-[80%] rounded-lg"
          style={{
            backgroundImage: course.thumbnail?
            `url(http://localhost:8000/${course.thumbnail.replace("public\\","")})`:
            `url(${courseThumbnail})`,
            backgroundSize:"cover",
            backgroundRepeat:"no-repeat",
            backgroundPosition:"center"
          }}
          onClick={() => navigate(`/${course._id}`)}
          ></div>
          <h2 className='text-2xl font-bold'>{course.title}</h2>
          <p className='text-xl font-semibold text-zinc-500 text-center'>{course.description.slice(0,20)+"..."}</p>
          <h2 className='text-2xl text-green-700 font-bold'>{course.price} Rs.</h2>
          <button className="bg-blue-600 text-white text-lg font-semibold font rounded-lg cursor-pointer hover:scale-105 "
          style={{ padding: "8px 10px",marginTop:"9px"}}  
          onClick={() => navigate(`/${course._id}`)}        
          >Checkout Now</button>
        </div>))}
      </div>
    </div>
  )
}

export default Dashboard


