import { z } from 'zod'

// ---------------------------------------------------------------------------
// Auth schemas
// ---------------------------------------------------------------------------
export const registerSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters').trim(),
  email: z.string().email('Invalid email address').trim().toLowerCase(),
  password: z.string().min(4, 'Password must be at least 4 characters')
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').trim().toLowerCase(),
  password: z.string().min(1, 'Password is required')
})

export const userIdSchema = z.object({
  id: z.string().min(1, 'User ID is required')
})

// ---------------------------------------------------------------------------
// Course schemas
// ---------------------------------------------------------------------------
export const courseIdSchema = z.object({
  id: z.string().min(1, 'Course ID is required')
})

export const courseDetailSchema = z.object({
  id: z.string().min(1, 'Course ID is required')
})

export const enrollSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  courseId: z.string().min(1, 'Course ID is required')
})

export const cancelEnrollSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  courseId: z.string().min(1, 'Course ID is required')
})

export const checkEnrollmentSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  courseId: z.string().min(1, 'Course ID is required')
})

export const getAllEnrollmentsSchema = z.object({
  userId: z.string().min(1, 'User ID is required')
})

// ---------------------------------------------------------------------------
// Notification schemas
// ---------------------------------------------------------------------------
export const createNotificationSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  type: z.enum(['info', 'success', 'warning', 'error']).optional(),
  link: z.string().nullable().optional()
})

export const getNotificationsSchema = z.object({
  userId: z.string().min(1, 'User ID is required')
})

export const markReadSchema = z.object({
  notificationId: z.string().min(1, 'Notification ID is required')
})

export const markAllReadSchema = z.object({
  userId: z.string().min(1, 'User ID is required')
})

export const deleteNotificationSchema = z.object({
  notificationId: z.string().min(1, 'Notification ID is required')
})

export const unreadCountSchema = z.object({
  userId: z.string().min(1, 'User ID is required')
})

// ---------------------------------------------------------------------------
// Task schemas
// ---------------------------------------------------------------------------
export const createTaskSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().default(''),
  time: z.string().optional().default('9:00 AM'),
  date: z.string().optional().default('Today'),
  priority: z.enum(['Low', 'Medium', 'High']).optional().default('Medium'),
  dueDate: z.string().nullable().optional().default(null)
})

export const getTasksSchema = z.object({
  userId: z.string().min(1, 'User ID is required')
})

export const updateTaskSchema = z.object({
  taskId: z.string().min(1, 'Task ID is required'),
  title: z.string().optional(),
  description: z.string().optional(),
  time: z.string().optional(),
  date: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
  completed: z.boolean().optional(),
  dueDate: z.string().nullable().optional()
})

export const taskIdSchema = z.object({
  taskId: z.string().min(1, 'Task ID is required')
})

export const toggleTaskSchema = z.object({
  taskId: z.string().min(1, 'Task ID is required')
})

export const deleteTaskSchema = z.object({
  taskId: z.string().min(1, 'Task ID is required')
})