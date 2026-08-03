import Course from '../models/course.model.js'
import User from '../models/user.model.js'
import { success } from '../utils/response.js'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Build last N month buckets (keys like "2025-01") so charts always show complete data
const getLastNMonths = (n = 12) => {
  const result = []
  const now = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    result.push({ key, label: `${MONTHS[d.getMonth()]} ${String(d.getFullYear()).slice(2)}` })
  }
  return result
}

// Mongoose expression to turn { year, month } into "YYYY-MM" string key
const toKey = {
  $concat: [
    { $toString: '$_id.year' },
    '-',
    {
      $cond: [
        { $lt: ['$_id.month', 10] },
        { $concat: ['0', { $toString: '$_id.month' }] },
        { $toString: '$_id.month' }
      ]
    }
  ]
}

// Count documents grouped by month (uses collection's createdAt)
const countByMonthPipeline = [
  {
    $group: {
      _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
      count: { $sum: 1 }
    }
  },
  { $project: { _id: 0, key: toKey, count: 1 } },
  { $sort: { key: 1 } }
]

const fillMonthCounts = (rows, months) => {
  const map = new Map(rows.map(r => [r.key, r.count]))
  return months.map(m => ({ key: m.key, label: m.label, count: map.get(m.key) || 0 }))
}

const fillMonthTotals = (rows, months) => {
  const map = new Map(rows.map(r => [r.key, r.total || 0]))
  return months.map(m => ({ key: m.key, label: m.label, total: map.get(m.key) || 0 }))
}

// Top courses by number of enrollments
const topCoursesPipeline = [
  { $unwind: '$enrolledCourses' },
  { $group: { _id: '$enrolledCourses', enrollments: { $sum: 1 } } },
  { $lookup: { from: 'courses', localField: '_id', foreignField: '_id', as: 'course' } },
  { $unwind: { path: '$course', preserveNullAndEmptyArrays: true } },
  {
    $project: {
      _id: 0,
      title: { $ifNull: ['$course.title', 'Deleted Course'] },
      enrollments: 1
    }
  },
  { $sort: { enrollments: -1 } },
  { $limit: 10 }
]

// Revenue per course (price summed across all enrollments)
const revenuePerCoursePipeline = [
  { $unwind: '$enrolledCourses' },
  { $lookup: { from: 'courses', localField: 'enrolledCourses', foreignField: '_id', as: 'course' } },
  { $unwind: { path: '$course', preserveNullAndEmptyArrays: true } },
  {
    $group: {
      _id: '$course.title',
      total: { $sum: { $ifNull: ['$course.price', 0] } },
      enrollments: { $sum: 1 }
    }
  },
  {
    $project: {
      _id: 0,
      title: { $ifNull: ['$_id', 'Deleted Course'] },
      total: 1,
      enrollments: 1
    }
  },
  { $sort: { total: -1 } },
  { $limit: 10 }
]

// Revenue grouped by month of enrollment (based on user account creation, since
// enrollments happen at registration in this app)
const revenueByMonthPipeline = [
  { $unwind: '$enrolledCourses' },
  { $lookup: { from: 'courses', localField: 'enrolledCourses', foreignField: '_id', as: 'course' } },
  { $unwind: { path: '$course', preserveNullAndEmptyArrays: true } },
  {
    $group: {
      _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
      total: { $sum: { $ifNull: ['$course.price', 0] } }
    }
  },
  { $project: { _id: 0, key: toKey, total: 1 } },
  { $sort: { key: 1 } }
]

// ---------------------------------------------------------------------------
// GET /api/v1/analytics/stats  -> summary cards
// ---------------------------------------------------------------------------
export const getOverallStats = async (_req, res) => {
  const [totalCourses, totalUsers, enrollmentRows, revenueRows] = await Promise.all([
    Course.countDocuments(),
    User.countDocuments(),
    User.aggregate([{ $unwind: '$enrolledCourses' }, { $count: 'total' }]),
    User.aggregate([
      { $unwind: '$enrolledCourses' },
      { $lookup: { from: 'courses', localField: 'enrolledCourses', foreignField: '_id', as: 'course' } },
      { $unwind: { path: '$course', preserveNullAndEmptyArrays: true } },
      { $group: { _id: null, total: { $sum: { $ifNull: ['$course.price', 0] } } } }
    ])
  ])

  return success(res, {
    statusCode: 200,
    message: 'Stats fetched successfully!',
    data: {
      totalCourses,
      totalUsers,
      totalEnrollments: enrollmentRows[0]?.total || 0,
      revenue: revenueRows[0]?.total || 0
    }
  })
}

// ---------------------------------------------------------------------------
// GET /api/v1/analytics/courses
// ---------------------------------------------------------------------------
export const getCoursesAnalytics = async (_req, res) => {
  const months = getLastNMonths(12)

  const [courseMonthlyRows, topCourses] = await Promise.all([
    Course.aggregate(countByMonthPipeline),
    User.aggregate(topCoursesPipeline)
  ])

  return success(res, {
    statusCode: 200,
    message: 'Course analytics fetched successfully!',
    data: {
      monthly: fillMonthCounts(courseMonthlyRows, months),
      topCourses
    }
  })
}

// ---------------------------------------------------------------------------
// GET /api/v1/analytics/users
// ---------------------------------------------------------------------------
export const getUsersAnalytics = async (_req, res) => {
  const months = getLastNMonths(12)

  const [userMonthlyRows, roleRows] = await Promise.all([
    User.aggregate(countByMonthPipeline),
    User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $project: { _id: 0, role: '$_id', count: 1 } },
      { $sort: { count: -1 } }
    ])
  ])

  return success(res, {
    statusCode: 200,
    message: 'User analytics fetched successfully!',
    data: {
      monthly: fillMonthCounts(userMonthlyRows, months),
      roles: roleRows
    }
  })
}

// ---------------------------------------------------------------------------
// GET /api/v1/analytics/enrollments
// ---------------------------------------------------------------------------
export const getEnrollmentsAnalytics = async (_req, res) => {
  const months = getLastNMonths(12)

  const [enrollmentMonthlyRows, topCourses] = await Promise.all([
    User.aggregate([
      { $match: { enrolledCourses: { $exists: true, $ne: [] } } },
      ...countByMonthPipeline
    ]),
    User.aggregate(topCoursesPipeline)
  ])

  return success(res, {
    statusCode: 200,
    message: 'Enrollment analytics fetched successfully!',
    data: {
      monthly: fillMonthCounts(enrollmentMonthlyRows, months),
      topCourses
    }
  })
}

// ---------------------------------------------------------------------------
// GET /api/v1/analytics/revenue
// ---------------------------------------------------------------------------
export const getRevenueAnalytics = async (_req, res) => {
  const months = getLastNMonths(12)

  const [revenueMonthlyRows, perCourse] = await Promise.all([
    User.aggregate(revenueByMonthPipeline),
    User.aggregate(revenuePerCoursePipeline)
  ])

  return success(res, {
    statusCode: 200,
    message: 'Revenue analytics fetched successfully!',
    data: {
      monthly: fillMonthTotals(revenueMonthlyRows, months),
      perCourse
    }
  })
}