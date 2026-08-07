import mongoose from 'mongoose'
import logger from '../utils/logger.js'
import { mongoUri } from '../utils/env.js'

export const connectDB = async () => {
  try {
    const uri = mongoUri()

    if (!uri) {
      throw new Error('MONGODB_URI is not defined')
    }

    await mongoose.connect(uri, {
      dbName: process.env.MONGO_DB_NAME || 'LMS',
      autoIndex: process.env.NODE_ENV !== 'production',
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority'
    })

    logger.info('Database connected successfully')
  } catch (error) {
    logger.fatal({ error: error.message, stack: error.stack }, 'Database connection failed')
    process.exit(1)
  }
}