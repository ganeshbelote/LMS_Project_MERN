import Notification from '../models/notification.model.js'

export const createNotification = async (req, res) => {
  try {
    const { userId, title, message, type, link } = req.body

    if (!userId || !title || !message) {
      return res.status(400).json({
        ok: false,
        message: 'userId, title and message are required!'
      })
    }

    const notification = await Notification.create({
      user: userId,
      title,
      message,
      type: type || 'info',
      link: link || null
    })

    return res.status(200).json({
      ok: true,
      message: 'Notification created successfully!',
      data: notification
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Failed to create notification!',
      error: error.message
    })
  }
}

export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({
        ok: false,
        message: 'userId is required!'
      })
    }

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(50)

    return res.status(200).json({
      ok: true,
      message: 'Notifications fetched successfully!',
      data: notifications
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Failed to fetch notifications!',
      error: error.message
    })
  }
}

export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body

    if (!notificationId) {
      return res.status(400).json({
        ok: false,
        message: 'notificationId is required!'
      })
    }

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    )

    if (!notification) {
      return res.status(404).json({
        ok: false,
        message: 'Notification not found!'
      })
    }

    return res.status(200).json({
      ok: true,
      message: 'Notification marked as read!',
      data: notification
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Failed to mark notification as read!',
      error: error.message
    })
  }
}

export const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({
        ok: false,
        message: 'userId is required!'
      })
    }

    await Notification.updateMany(
      { user: userId, isRead: false },
      { isRead: true }
    )

    return res.status(200).json({
      ok: true,
      message: 'All notifications marked as read!'
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Failed to mark notifications as read!',
      error: error.message
    })
  }
}

export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.body

    if (!notificationId) {
      return res.status(400).json({
        ok: false,
        message: 'notificationId is required!'
      })
    }

    await Notification.findByIdAndDelete(notificationId)

    return res.status(200).json({
      ok: true,
      message: 'Notification deleted successfully!'
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Failed to delete notification!',
      error: error.message
    })
  }
}

export const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({
        ok: false,
        message: 'userId is required!'
      })
    }

    const count = await Notification.countDocuments({
      user: userId,
      isRead: false
    })

    return res.status(200).json({
      ok: true,
      data: { count }
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Failed to get unread count!',
      error: error.message
    })
  }
}