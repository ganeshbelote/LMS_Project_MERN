import { motion } from "framer-motion"
import { CheckSquare, Plus, Clock, Calendar } from 'lucide-react'

const Task = () => {
  const tasks = [
    { id: 1, title: 'Complete React.js Assignment', time: '7:00 AM', date: 'Today', priority: 'High', completed: false },
    { id: 2, title: 'Review JavaScript Fundamentals', time: '9:00 AM', date: 'Today', priority: 'Medium', completed: false },
    { id: 3, title: 'Build Todo App Project', time: '2:00 PM', date: 'Tomorrow', priority: 'High', completed: false },
    { id: 4, title: 'Study Data Structures', time: '5:00 PM', date: 'Tomorrow', priority: 'Low', completed: true },
    { id: 5, title: 'Practice Coding Challenges', time: '7:00 PM', date: 'Feb 10', priority: 'Medium', completed: false },
  ]

  const priorityColors = {
    High: 'bg-red-100 text-red-600',
    Medium: 'bg-yellow-100 text-yellow-600',
    Low: 'bg-green-100 text-green-600'
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
            <p className="text-sm text-gray-500">Manage your assignments and to-dos</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition font-medium text-sm">
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <CheckSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No tasks yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${
                task.completed ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 cursor-pointer transition-colors ${
                  task.completed 
                    ? 'bg-green-500 border-green-500' 
                    : 'border-gray-300 hover:border-blue-500'
                }`}>
                  {task.completed && (
                    <svg viewBox="0 0 24 24" className="w-full h-full text-white p-0.5">
                      <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className={`font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {task.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> {task.date}
                        </span>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Task