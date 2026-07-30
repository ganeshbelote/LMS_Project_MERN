import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "../context/AuthContext"
import api from "../utils/api"
import { Inbox as InboxIcon, Bell, CheckCheck, Trash2, Loader } from 'lucide-react'
import { toast } from 'react-toastify'

const Inbox = () => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotifications = async () => {
    try {
      const res = await api.post('/notifications/', {
        userId: user?._id || localStorage.getItem('id')
      })
      if (res.data.ok) {
        setNotifications(res.data.data)
        const unread = res.data.data.filter(n => !n.isRead).length
        setUnreadCount(unread)
      }
    } catch {
      // silently fail - show empty state
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?._id || localStorage.getItem('id')) {
      fetchNotifications()
    } else {
      setLoading(false)
    }
  }, [user])

  const handleMarkAsRead = async (id) => {
    try {
      await api.post('/notifications/markRead', { notificationId: id })
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch {
      toast.error('Failed to mark as read')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await api.post('/notifications/markAllRead', {
        userId: user?._id || localStorage.getItem('id')
      })
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
      toast.success('All marked as read')
    } catch {
      toast.error('Failed to mark all as read')
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.post('/notifications/delete', { notificationId: id })
      setNotifications(prev => prev.filter(n => n._id !== id))
      toast.success('Notification deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'success': return '🟢'
      case 'warning': return '🟡'
      case 'error': return '🔴'
      default: return '🔵'
    }
  }

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-4 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-3">
          {[1,2,3,4].map(i => <div key={i} className="h-20 bg-gray-200 rounded-xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 rounded-xl">
            <InboxIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
            <p className="text-sm text-gray-500">
              {unreadCount > 0 ? `${unreadCount} unread` : 'No unread notifications'}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-2 rounded-lg hover:bg-blue-50 transition"
          >
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-1">No notifications yet</h3>
          <p className="text-gray-500">We'll notify you when something arrives</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif, i) => (
            <motion.div
              key={notif._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`bg-white rounded-xl p-4 shadow-sm border transition-all ${
                notif.isRead ? 'border-gray-100' : 'border-blue-200 bg-blue-50/30'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
                  notif.type === 'success' ? 'bg-green-100' :
                  notif.type === 'warning' ? 'bg-yellow-100' :
                  notif.type === 'error' ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  {getTypeIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`${notif.isRead ? 'text-gray-700' : 'text-gray-900 font-medium'}`}>
                        {notif.title}
                      </p>
                      {notif.message && (
                        <p className="text-sm text-gray-500 mt-0.5">{notif.message}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!notif.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notif._id)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Mark as read"
                        >
                          <CheckCheck className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notif._id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notif.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Inbox