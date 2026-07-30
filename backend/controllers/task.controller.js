import mongoose from 'mongoose'
import Task from '../models/task.model.js'

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id)

export const createTask = async (req, res) => {
  try {
    const { userId, title, description, time, date, priority, dueDate } = req.body

    if (!userId || !title) {
      return res.status(400).json({
        ok: false,
        message: 'userId and title are required!'
      })
    }

    if (!isValidId(userId)) {
      return res.status(400).json({
        ok: false,
        message: 'Invalid userId format!'
      })
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

    return res.status(200).json({
      ok: true,
      message: 'Task created successfully!',
      data: task
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Failed to create task!',
      error: error.message
    })
  }
}

export const getUserTasks = async (req, res) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({
        ok: false,
        message: 'userId is required!'
      })
    }

    if (!isValidId(userId)) {
      return res.status(200).json({
        ok: true,
        message: 'No tasks found for invalid user id',
        data: []
      })
    }

    const tasks = await Task.find({ user: userId })
      .sort({ createdAt: -1 })

    return res.status(200).json({
      ok: true,
      message: 'Tasks fetched successfully!',
      data: tasks
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Failed to fetch tasks!',
      error: error.message
    })
  }
}

export const updateTask = async (req, res) => {
  try {
    const { taskId, title, description, time, date, priority, completed, dueDate } = req.body

    if (!taskId) {
      return res.status(400).json({
        ok: false,
        message: 'taskId is required!'
      })
    }

    const updateFields = {}
    if (title !== undefined) updateFields.title = title
    if (description !== undefined) updateFields.description = description
    if (time !== undefined) updateFields.time = time
    if (date !== undefined) updateFields.date = date
    if (priority !== undefined) updateFields.priority = priority
    if (completed !== undefined) updateFields.completed = completed
    if (dueDate !== undefined) updateFields.dueDate = dueDate

    const task = await Task.findByIdAndUpdate(
      taskId,
      updateFields,
      { new: true }
    )

    if (!task) {
      return res.status(404).json({
        ok: false,
        message: 'Task not found!'
      })
    }

    return res.status(200).json({
      ok: true,
      message: 'Task updated successfully!',
      data: task
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Failed to update task!',
      error: error.message
    })
  }
}

export const toggleTaskComplete = async (req, res) => {
  try {
    const { taskId } = req.body

    if (!taskId || !isValidId(taskId)) {
      return res.status(400).json({
        ok: false,
        message: 'Valid taskId is required!'
      })
    }

    const task = await Task.findById(taskId)
    if (!task) {
      return res.status(404).json({
        ok: false,
        message: 'Task not found!'
      })
    }

    task.completed = !task.completed
    await task.save()

    return res.status(200).json({
      ok: true,
      message: task.completed ? 'Task marked as completed!' : 'Task marked as incomplete!',
      data: task
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Failed to toggle task!',
      error: error.message
    })
  }
}

export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.body

    if (!taskId || !isValidId(taskId)) {
      return res.status(400).json({
        ok: false,
        message: 'Valid taskId is required!'
      })
    }

    await Task.findByIdAndDelete(taskId)

    return res.status(200).json({
      ok: true,
      message: 'Task deleted successfully!'
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Failed to delete task!',
      error: error.message
    })
  }
}