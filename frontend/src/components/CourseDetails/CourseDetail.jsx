import { useState } from 'react';
import { motion } from 'framer-motion';
import thumbnailimg from '../../assets/image/19199494.jpg'
import userImg from '../../assets/image/user.png'
import { Bell, Clock, Users, Award, PlayCircle, CheckCircle, Lock } from 'lucide-react';

const CourseDetail = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const course = {
    title: "Beginner's Guide to Frontend",
    instructor: "Jane Doe",
    rating: 4.8,
    students: 1247,
    duration: "12h 30m",
    level: "Beginner",
    progress: 60,
    description: "Master HTML, CSS, JavaScript, and React from scratch. Build real-world projects and become a confident frontend developer.",
    whatYouWillLearn: [
      "Build responsive websites with modern CSS",
      "Create interactive UIs with JavaScript",
      "Master React and build single-page applications",
      "Deploy websites to the internet",
      "Best practices and clean code principles"
    ],
    curriculum: [
      { id: 1, title: "Introduction to HTML", duration: "45m", lessons: 8, completed: true },
      { id: 2, title: "Styling with CSS", duration: "2h 15m", lessons: 12, completed: true },
      { id: 3, title: "JavaScript Fundamentals", duration: "3h 30m", lessons: 18, completed: true },
      { id: 4, title: "Advanced JavaScript", duration: "4h", lessons: 22, completed: false },
      { id: 5, title: "Introduction to React", duration: "2h", lessons: 15, completed: false },
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-blue-600 overflow-hidden">
        <img 
          src={thumbnailimg} 
          alt={course.title}
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-black/70" />
        
        <div className="relative h-full flex items-center px-6 max-w-7xl mx-auto">
          <div className="text-white">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold mb-4"
            >
              {course.title}
            </motion.h1>
            <div className="flex items-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <img src={userImg} alt={course.instructor} className="p-2 w-12 h-12 rounded-full border-2 border-white" />
                <span>{course.instructor}</span>
              </div>
              <span className="flex items-center gap-1">
                <Award className="w-5 h-5 text-yellow-400" /> {course.rating}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-5 h-5" /> {course.students.toLocaleString()} students
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              {/* Progress */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-2xl font-bold text-gray-800">Your Progress</h3>
                  <span className="text-3xl font-bold text-blue-600">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${course.progress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-blue-500 rounded-full relative"
                  >
                    <div className="absolute inset-0 bg-blue-500 bg-opacity-30" />
                  </motion.div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="flex-1 bg-blue-600 text-white py-4 px-8 rounded-xl font-semibold text-lg shadow-lg flex items-center justify-center gap-3"
                >
                  <PlayCircle className="w-6 h-6" />
                  Continue Learning
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="p-4 bg-white border-2 border-blue-600 rounded-xl shadow-lg"
                >
                  <Bell className="w-6 h-6 text-blue-600" />
                </motion.button>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <div className="flex gap-8">
                  {['overview', 'curriculum', 'reviews'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-4 px-2 capitalize font-medium transition-colors relative ${
                        activeTab === tab 
                          ? 'text-blue-600' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <motion.div 
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">What you'll learn</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {course.whatYouWillLearn.map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'curriculum' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold mb-4">Course Content</h3>
                  {course.curriculum.map((section) => (
                    <motion.div
                      key={section.id}
                      whileHover={{ x: 5 }}
                      className="bg-gray-50 rounded-xl p-6 cursor-pointer transition-all hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {section.completed ? (
                            <CheckCircle className="w-8 h-8 text-green-500" />
                          ) : (
                            <Lock className="w-8 h-8 text-gray-400" />
                          )}
                          <div>
                            <h4 className="font-semibold text-lg">{section.title}</h4>
                            <p className="text-sm text-gray-600">
                              {section.lessons} lessons • {section.duration}
                            </p>
                          </div>
                        </div>
                        <Clock className="w-6 h-6 text-gray-500" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Info Card */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <h3 className="text-xl font-bold mb-6">Course Includes</h3>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Duration</p>
                    <p className="text-gray-600">{course.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Level</p>
                    <p className="text-gray-600">{course.level}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Certificate</p>
                    <p className="text-gray-600">Yes, upon completion</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Instructor Card */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-6 text-center"
            >
              <img 
                src={userImg} 
                alt={course.instructor}
                className="p-4 w-24 h-24 rounded-full mx-auto mb-4 border-4 border-black"
              />
              <h4 className="text-xl font-bold">{course.instructor}</h4>
              <p className="text-gray-600 mb-4">Senior Frontend Developer</p>
              <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition">
                View Profile
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;