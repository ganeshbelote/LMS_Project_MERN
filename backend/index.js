import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import {connectDB} from "./database/db.js"

import auth from "./routes/auth.route.js"
import course from "./routes/course.route.js";

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static("public"))

const PORT = process.env.PORT || 3000

connectDB()

app.use('/api/v1/auth',auth)
app.use("/api/v1/courses", course);

app.listen(PORT,()=>{
    console.log(`Server is started on ${PORT}`)
})