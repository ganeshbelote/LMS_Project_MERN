import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar'; // Assuming Navbar is in the same directory
import Footer from '../components/Footer'; // Assuming Footer is in the same directory

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'Alex',
    email: 'alex@example.com',
    bio: 'Passionate learner in web development.',
    profileImage: 'https://via.placeholder.com/150',
  });
  const [formData, setFormData] = useState({ ...userData });
  const [imagePreview, setImagePreview] = useState(userData.profileImage);

  useEffect(() => {
    // Simulate fetching user data
    // In real app, fetch from API
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserData({ ...formData });
    setIsEditing(false);
    // In real app, send update to API
  };

  const enrolledCourses = [
    { id: 1, title: 'Frontend Development', progress: 60 },
    { id: 2, title: 'Backend Basics', progress: 30 },
    { id: 3, title: 'UI/UX Design', progress: 45 },
  ];

  const achievements = [
    'Completed Introduction to React',
    'Earned Badge in JavaScript Fundamentals',
    'Top 10% in Monthly Quiz Challenge',
  ];

  const purchaseHistory = [
    { id: 1, course: 'Advanced Node.js', date: '2025-08-15', amount: '$49.99' },
    { id: 2, course: 'Full Stack Mastery', date: '2025-07-20', amount: '$99.99' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center flex-col">
      <Navbar isAuthenticated={true} user={userData} />
      <main className="flex-grow p-4">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-purple-600 mb-6">Profile</h2>
          
          {/* Personal Info */}
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <img
                src={isEditing ? imagePreview : userData.profileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full mr-4"
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{userData.name}</h3>
                <p className="text-gray-600">{userData.email}</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{userData.bio}</p>
            {!isEditing ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
              >
                Edit Profile
              </motion.button>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Profile Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-1 block w-full"
                  />
                </div>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
                  >
                    Save Changes
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({ ...userData });
                      setImagePreview(userData.profileImage);
                    }}
                    className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            )}
          </section>

          {/* Enrolled Courses */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold text-purple-600 mb-4">Enrolled Courses</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {enrolledCourses.map((course) => (
                <motion.div
                  key={course.id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-lg shadow-md p-4"
                >
                  <h4 className="text-lg font-medium text-gray-800">{course.title}</h4>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-purple-600 h-2.5 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{course.progress}% Complete</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Achievements */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold text-purple-600 mb-4">Achievements</h3>
            <ul className="list-disc list-inside space-y-2">
              {achievements.map((ach, index) => (
                <li key={index} className="text-gray-600">{ach}</li>
              ))}
            </ul>
          </section>

          {/* Purchase History */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold text-purple-600 mb-4">Purchase History</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-purple-100">
                  <th className="p-2">Course</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {purchaseHistory.map((purchase) => (
                  <tr key={purchase.id} className="border-b">
                    <td className="p-2">{purchase.course}</td>
                    <td className="p-2">{purchase.date}</td>
                    <td className="p-2">{purchase.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Settings */}
          <section>
            <h3 className="text-xl font-semibold text-purple-600 mb-4">Settings</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Email Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Two-Factor Authentication</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
              >
                Delete Account
              </motion.button>
            </div>
          </section>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;