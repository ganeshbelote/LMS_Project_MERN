import express from "express"
import {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount
} from '../controllers/notification.controller.js'

const router = express.Router()

router.route('/').post(getUserNotifications)
router.route('/create').post(createNotification)
router.route('/markRead').post(markAsRead)
router.route('/markAllRead').post(markAllAsRead)
router.route('/unreadCount').post(getUnreadCount)
router.route('/delete').post(deleteNotification)

export default router