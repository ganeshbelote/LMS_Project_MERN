import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, BookOpen, Users, TrendingUp, DollarSign } from 'lucide-react'
import api from '../utils/api'

const AdminDashboard = () => {
  const { user, role, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalUsers: 0,
    totalEnrollments: 0,
    revenue: 0
  })

  useEffect(() => {
    if (!isAuthenticated || role?.toLowerCase() !== 'admin') {
      navigate('/')
    }
    fetchStats()
  }, [isAuthenticated, role])

  const fetchStats = async () => {
    try {
      const coursesRes = await api.get('/courses/')
      if (coursesRes.data.ok) {
        setStats(prev => ({ ...prev, totalCourses: coursesRes.data.data.length }))
      }
    } catch {
      // silently fail
    }
  }

  const statCards = [
    { label: 'Total Courses', value: stats.totalCourses, icon: BookOpen, color: 'bg-blue-500' },
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-green-500' },
    { label: 'Enrollments', value: stats.totalEnrollments, icon: TrendingUp, color: 'bg-purple-500' },
    { label: 'Revenue', value: `₹${stats.revenue}`, icon: DollarSign, color: 'bg-orange-500' },
  ]

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminDashboard