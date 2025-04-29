import mongoose from "mongoose";

export const connectDB = async (req,res) => {
    try {
        mongoose.connect(process.env.MONGO_URL)
        console.log("Database Connected 👍")
    } catch (error) {
        console.log("Database connection Failed !!",error.message)
        process.exit(1)
    }
}