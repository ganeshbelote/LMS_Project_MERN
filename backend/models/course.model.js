import mongoose from 'mongoose'

const videoSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  videoPath: {
    type: String,
    required: true,
  },
});

const courseSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    thumbnail: { 
      type: String 
    }, 
    price: { 
      type: Number, 
      required: true 
    },
    videos: [videoSchema],    
  },
  {
    timestamps: true
  }
)

const Course = mongoose.model('Course', courseSchema)
export default Course
