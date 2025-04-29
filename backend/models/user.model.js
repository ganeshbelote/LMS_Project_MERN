import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim:true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase:true,
      trim:true
    },
    password: {
      type: String,
      required: true,
      minlength:4
    },
    role:{
      type:String,
      enum:["user","admin"],
      default:"user"
    },
    enrolledCourses:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Course"
    }]
  },
  {
    timestamps: true
  }
)

const User = mongoose.model('User', userSchema)
export default User
