import express from 'express'
import {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount
} from '../controllers/notification.controller.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import { validate } from '../middlewares/validate.js'
import {
  createNotificationSchema,
  getNotificationsSchema,
  markReadSchema,
  markAllReadSchema,
  deleteNotificationSchema,
  unreadCountSchema
} from '../schemas/index.js'

const router = express.Router()

router.route('/').post(validate(getNotificationsSchema), asyncHandler(getUserNotifications))
router.route('/create').post(validate(createNotificationSchema), asyncHandler(createNotification))
router.route('/markRead').post(validate(markReadSchema), asyncHandler(markAsRead))
router.route('/markAllRead').post(validate(markAllReadSchema), asyncHandler(markAllAsRead))
router.route('/unreadCount').post(validate(unreadCountSchema), asyncHandler(getUnreadCount))
router.route('/delete').post(validate(deleteNotificationSchema), asyncHandler(deleteNotification))

export default router