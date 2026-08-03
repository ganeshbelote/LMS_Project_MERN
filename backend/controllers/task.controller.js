import mongoose from 'mongoose'
import Task from '../models/task.model.js'
import { success } from '../utils/response.js'
import { NotFoundError, ValidationError } from '../errors/index.js'

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id)

export const createTask = async (req, res) => {
  const { userId, title, description, time, date, priority, dueDate } = req.body

  if (!isValidId(userId)) {
    throw new ValidationError('Invalid userId format!')
  }

  const task = await Task.create({
    user: userId,
    title,
    description: description || '',
    time: time || '9:00 AM',
    date: date || 'Today',
    priority: priority || 'Medium',
    dueDate: dueDate || null
  })

  return success(res, {
    statusCode: 200,
    message: 'Task created successfully!',
    data: task
  })
}

export const getUserTasks = async (req, res) => {
  const { userId } = req.body

  if (!isValidId(userId)) {
    return success(res, {
      statusCode: 200,
      message: 'No tasks found for invalid user id',
      data: []
    })
  }

  const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 })

  return success(res, {
    statusCode: 200,
    message: 'Tasks fetched successfully!',
    data: tasks
  })
}

export const updateTask = async (req, res) => {
  const { taskId, title, description, time, date, priority, completed, dueDate } = req.body

  const updateFields = {}
  if (title !== undefined) updateFields.title = title
  if (description !== undefined) updateFields.description = description
  if (time !== undefined) updateFields.time = time
  if (date !== undefined) updateFields.date = date
  if (priority !== undefined) updateFields.priority = priority
  if (completed !== undefined) updateFields.completed = completed
  if (dueDate !== undefined) updateFields.dueDate = dueDate

  const task = await Task.findByIdAndUpdate(taskId, updateFields, { new: true })
  if (!task) {
    throw new NotFoundError('Task not found!')
  }

  return success(res, {
    statusCode: 200,
    message: 'Task updated successfully!',
    data: task
  })
}

export const toggleTaskComplete = async (req, res) => {
  const { taskId } = req.body

  if (!isValidId(taskId)) {
    throw new ValidationError('Valid taskId is required!')
  }

  const task = await Task.findById(taskId)
  if (!task) {
    throw new NotFoundError('Task not found!')
  }

  task.completed = !task.completed
  await task.save()

  return success(res, {
    statusCode: 200,
    message: task.completed ? 'Task marked as completed!' : 'Task marked as incomplete!',
    data: task
  })
}

export const deleteTask = async (req, res) => {
  const { taskId } = req.body

  if (!isValidId(taskId)) {
    throw new ValidationError('Valid taskId is required!')
  }

  const result = await Task.findByIdAndDelete(taskId)
  if (!result) {
    throw new NotFoundError('Task not found!')
  }

  return success(res, {
    statusCode: 200,
    message: 'Task deleted successfully!'
  })
}