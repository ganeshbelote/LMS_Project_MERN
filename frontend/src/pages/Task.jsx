import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "../context/AuthContext"
import api from "../utils/api"
import { CheckSquare, Plus, Clock, Calendar, Trash2, X, Loader, AlertCircle } from 'lucide-react'
import { toast } from 'react-toastify'

const getUserId = () => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser)
      return parsed._id || parsed.id || localStorage.getItem('id')
    } catch {}
  }
  return localStorage.getItem('id')
}

const Task = () => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    time: '9:00 AM',
    date: 'Today',
    priority: 'Medium'
  })
  const [submitting, setSubmitting] = useState(false)

  const userId = user?._id || user?.id || getUserId()

  const fetchTasks = async () => {
    setError(null)
    if (!userId) {
      setError('User not authenticated. Please login again.')
      setLoading(false)
      return
    }
    try {
      console.log('Fetching tasks for user:', userId)
      const res = await api.post('/tasks/', { userId })
      console.log('Tasks response:', res.data)
      if (res.data.ok) {
        setTasks(res.data.data)
      } else {
        setError(res.data.message || 'Failed to fetch tasks')
      }
    } catch (err) {
      console.error('Fetch tasks error:', err.response || err.message)
      const msg = err.response?.data?.message || `Server error (${err.response?.status || 'connection'}). Is the backend running on port 8000?`
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchTasks()
    } else {
      setLoading(false)
      setError('Please login to view tasks')
    }
  }, [userId])

  const handleToggleComplete = async (taskId) => {
    try {
      const res = await api.post('/tasks/toggle', { taskId })
      if (res.data.ok) {
        setTasks(prev =>
          prev.map(t => t._id === taskId ? { ...t, completed: !t.completed } : t)
        )
        toast.success(res.data.message)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task')
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      const res = await api.post('/tasks/delete', { taskId })
      if (res.data.ok) {
        setTasks(prev => prev.filter(t => t._id !== taskId))
        toast.success('Task deleted successfully')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete task')
    }
  }

  const handleCreateTask = async (e) => {
    e.preventDefault()
    if (!newTask.title.trim()) {
      toast.error('Task title is required')
      return
    }
    setSubmitting(true)
    try {
      console.log('Creating task for user:', userId)
      const res = await api.post('/tasks/create', {
        userId,
        ...newTask
      })
      console.log('Create response:', res.data)
      if (res.data.ok) {
        setTasks(prev => [res.data.data, ...prev])
        setShowAddModal(false)
        setNewTask({ title: '', description: '', time: '9:00 AM', date: 'Today', priority: 'Medium' })
        toast.success('Task created successfully!')
      } else {
        toast.error(res.data.message || 'Failed to create task')
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Server error. Is the backend running?'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const priorityColors = {
    High: 'bg-red-100 text-red-600',
    Medium: 'bg-yellow-100 text-yellow-600',
    Low: 'bg-green-100 text-green-600'
  }

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-4 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-xl" />)}
        </div>
      </div>
    )
  }

  if (error && tasks.length === 0) {
    return (
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Connection Error</h3>
          <p className="text-gray-500 mb-4 max-w-md mx-auto">{error}</p>
          <button
            onClick={() => { setLoading(true); fetchTasks(); }}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 rounded-xl">
            <CheckSquare className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Tasks</h2>
            <p className="text-sm text-gray-500">
              {tasks.filter(t => !t.completed).length} pending • {tasks.filter(t => t.completed).length} completed
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition font-medium text-sm shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <CheckSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-1">No tasks yet</h3>
          <p className="text-gray-500 mb-4">Create your first task to get started</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition font-medium"
          >
            Create Task
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task, i) => (
            <motion.div
              key={task._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all ${
                task.completed ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => handleToggleComplete(task._id)}
                  className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 cursor-pointer transition-colors flex items-center justify-center ${
                    task.completed
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 hover:border-blue-500'
                  }`}
                >
                  {task.completed && (
                    <svg viewBox="0 0 24 24" className="w-3 h-3 text-white">
                      <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className={`font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className={`text-sm mt-0.5 ${task.completed ? 'text-gray-300' : 'text-gray-500'}`}>
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {task.time || 'N/A'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> {task.date || 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${priorityColors[task.priority] || priorityColors.Medium}`}>
                        {task.priority || 'Medium'}
                      </span>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">Create New Task</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Task Title *</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="What needs to be done?"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newTask.description}
                    onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Optional description..."
                    rows={2}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      type="text"
                      value={newTask.time}
                      onChange={e => setNewTask({ ...newTask, time: e.target.value })}
                      placeholder="e.g. 9:00 AM"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="text"
                      value={newTask.date}
                      onChange={e => setNewTask({ ...newTask, date: e.target.value })}
                      placeholder="e.g. Today"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition font-medium disabled:opacity-50"
                  >
                    {submitting ? 'Creating...' : 'Create Task'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Task