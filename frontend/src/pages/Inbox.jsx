import { motion } from "framer-motion"
import { Inbox as InboxIcon } from 'lucide-react'

const Inbox = () => {
  const notifications = [
    { id: 1, title: 'New course available: Advanced React Patterns', time: '2 hours ago', initials: 'AR' },
    { id: 2, title: 'Quiz deadline approaching: JavaScript Fundamentals', time: '5 hours ago', initials: 'JF' },
    { id: 3, title: 'Your certificate for HTML/CSS is ready', time: '1 day ago', initials: 'HC' },
    { id: 4, title: 'New message from instructor: Jane Doe', time: '2 days ago', initials: 'JD' },
    { id: 5, title: 'Course progress: You completed 60% of Backend Basics', time: '3 days ago', initials: 'BB' },
  ]

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-blue-100 rounded-xl">
          <InboxIcon className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Inbox</h2>
          <p className="text-sm text-gray-500">Your notifications and messages</p>
        </div>
      </div>

      <div className="space-y-2">
        {notifications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <InboxIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notif, i) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {notif.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 font-medium">{notif.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

export default Inbox