import Notification from '../models/notification.model.js'
import { success } from '../utils/response.js'
import { NotFoundError } from '../errors/index.js'

export const createNotification = async (req, res) => {
  const { userId, title, message, type, link } = req.body

  const notification = await Notification.create({
    user: userId,
    title,
    message,
    type: type || 'info',
    link: link || null
  })

  return success(res, {
    statusCode: 200,
    message: 'Notification created successfully!',
    data: notification
  })
}

export const getUserNotifications = async (req, res) => {
  const { userId } = req.body

  const notifications = await Notification.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(50)

  return success(res, {
    statusCode: 200,
    message: 'Notifications fetched successfully!',
    data: notifications
  })
}

export const markAsRead = async (req, res) => {
  const { notificationId } = req.body

  const notification = await Notification.findByIdAndUpdate(
    notificationId,
    { isRead: true },
    { new: true }
  )

  if (!notification) {
    throw new NotFoundError('Notification not found!')
  }

  return success(res, {
    statusCode: 200,
    message: 'Notification marked as read!',
    data: notification
  })
}

export const markAllAsRead = async (req, res) => {
  const { userId } = req.body

  const result = await Notification.updateMany(
    { user: userId, isRead: false },
    { isRead: true }
  )

  return success(res, {
    statusCode: 200,
    message: 'All notifications marked as read!',
    data: { modifiedCount: result.modifiedCount || 0 }
  })
}

export const deleteNotification = async (req, res) => {
  const { notificationId } = req.body

  const result = await Notification.findByIdAndDelete(notificationId)
  if (!result) {
    throw new NotFoundError('Notification not found!')
  }

  return success(res, {
    statusCode: 200,
    message: 'Notification deleted successfully!'
  })
}

export const getUnreadCount = async (req, res) => {
  const { userId } = req.body

  const count = await Notification.countDocuments({
    user: userId,
    isRead: false
  })

  return success(res, {
    statusCode: 200,
    message: 'Unread count fetched successfully!',
    data: { count }
  })
}