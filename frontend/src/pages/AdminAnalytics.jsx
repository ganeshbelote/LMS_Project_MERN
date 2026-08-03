import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../utils/api'
import { BookOpen, Users, TrendingUp, DollarSign, BarChart3, ArrowLeft, Loader } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BarChart from '../components/Analytics/BarChart'
import LineChart from '../components/Analytics/LineChart'
import TopList from '../components/Analytics/TopList'
import DonutChart from '../components/Analytics/DonutChart'

const TABS = [
  { id: 'courses', label: 'Courses', icon: BookOpen, color: '#3b82f6', endpoint: '/analytics/courses' },
  { id: 'users', label: 'Users', icon: Users, color: '#22c55e', endpoint: '/analytics/users' },
  { id: 'enrollments', label: 'Enrollments', icon: TrendingUp, color: '#a855f7', endpoint: '/analytics/enrollments' },
  { id: 'revenue', label: 'Revenue', icon: DollarSign, color: '#f59e0b', endpoint: '/analytics/revenue' }
]

const fmtMoney = n => {
  const num = Number(n)
  if (!Number.isFinite(num)) return '₹0k'
  return `₹${(num / 1000).toFixed(1)}k`
}

const AdminAnalytics = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('courses')
  const [stats, setStats] = useState(null)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch summary stats once on mount
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await api.get('/analytics/stats')
        if (!cancelled && res.data.ok) setStats(res.data.data)
      } catch (err) {
        if (!cancelled) console.error('Failed to fetch stats', err)
      }
    })()
    return () => { cancelled = true }
  }, [])

  // Fetch tab-specific analytics whenever the active tab changes
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    const tab = TABS.find(t => t.id === activeTab)

    const load = async () => {
      try {
        const res = await api.get(tab.endpoint)
        if (cancelled) return
        if (res.data.ok) setData(res.data.data)
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load analytics')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [activeTab])

  const roleColors = {
    user: '#22c55e',
    admin: '#3b82f6'
  }

  const renderTabContent = () => {
    if (!data) return null

    // Defensive defaults so partial/failed API responses never crash the UI
    const monthly = data.monthly || []
    const topCourses = data.topCourses || []
    const roles = data.roles || []
    const perCourse = data.perCourse || []

    switch (activeTab) {
      case 'courses':
        return (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">Courses Added (Last 12 Months)</h4>
                <BarChart data={monthly} color="#3b82f6" valueKey="count" />
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <TopList
                  data={topCourses}
                  title="Top Courses by Enrollments"
                  valueKey="enrollments"
                  barColor="#3b82f6"
                  labelColor="#2563eb"
                />
              </div>
            </div>
          </>
        )

      case 'users':
        return (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">New Users (Last 12 Months)</h4>
                <BarChart data={monthly} color="#22c55e" valueKey="count" />
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">Users by Role</h4>
                <DonutChart
                  data={roles.map(r => ({ ...r, color: roleColors[r.role] || '#6b7280' }))}
                />
              </div>
            </div>
          </>
        )

      case 'enrollments':
        return (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">Enrollments (Last 12 Months)</h4>
                <BarChart data={monthly} color="#a855f7" valueKey="count" />
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <TopList
                  data={topCourses}
                  title="Most Enrolled Courses"
                  valueKey="enrollments"
                  barColor="#a855f7"
                  labelColor="#9333ea"
                />
              </div>
            </div>
          </>
        )

      case 'revenue':
        return (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">Revenue Trend (Last 12 Months)</h4>
                <LineChart data={monthly} color="#f59e0b" valueKey="total" formatValue={fmtMoney} />
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <TopList
                  data={perCourse}
                  title="Revenue by Course"
                  valueKey="total"
                  formatValue={fmtMoney}
                  barColor="#f59e0b"
                  labelColor="#d97706"
                />
              </div>
            </div>
          </>
        )

      default:
        return null
    }
  }

  const statCards = [
    { label: 'Total Courses', value: stats?.totalCourses ?? '-', icon: BookOpen, bg: 'bg-blue-50', text: 'text-blue-600' },
    { label: 'Total Users', value: stats?.totalUsers ?? '-', icon: Users, bg: 'bg-green-50', text: 'text-green-600' },
    { label: 'Enrollments', value: stats?.totalEnrollments ?? '-', icon: TrendingUp, bg: 'bg-purple-50', text: 'text-purple-600' },
    { label: 'Revenue', value: stats ? `₹${(Number(stats.revenue) || 0).toLocaleString('en-IN')}` : '-', icon: DollarSign, bg: 'bg-orange-50', text: 'text-orange-600' }
  ]

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header with back button */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" /> Analytics Dashboard
          </h2>
          <p className="text-sm text-gray-500 mt-1">Live insights and trends for your platform</p>
        </div>
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Profile
        </button>
      </motion.div>

      {/* Summary stat cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {statCards.map(card => (
          <div key={card.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl ${card.bg} flex items-center justify-center flex-shrink-0`}>
              <card.icon className={`w-5 h-5 ${card.text}`} />
            </div>
            <div className="min-w-0">
              <p className="text-lg md:text-xl font-bold text-gray-800 truncate">{card.value}</p>
              <p className="text-xs text-gray-500">{card.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 flex flex-col items-center justify-center gap-3">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-sm text-gray-500">Loading analytics...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <p className="text-red-500 font-medium">Failed to load data</p>
            <p className="text-sm text-gray-500 mt-1">{error}</p>
          </div>
        ) : (
          renderTabContent()
        )}
      </motion.div>
    </div>
  )
}

export default AdminAnalytics