import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URL, {
      dbName: 'LMS',
      autoIndex: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority'
    })
    console.log('Database Connected 👍')
  } catch (error) {
    console.log('Database connection Failed !!', error.message)
    process.exit(1)
  }
}
