import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    time: {
      type: String,
      default: '9:00 AM'
    },
    date: {
      type: String,
      default: 'Today'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    completed: {
      type: Boolean,
      default: false
    },
    dueDate: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
)

const Task = mongoose.model('Task', taskSchema)
export default Task