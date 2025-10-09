import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import userRouter from "./admin-api/routes/user.route.js"
import authRouter from "./admin-api/routes/auth.route.js"
import testRouter from "./admin-api/routes/test.route.js"
import documentRouter from "./admin-api/routes/document.route.js";
import feedbackRouter from "./admin-api/routes/feedback.route.js";
import { createAdminUser } from "./admin-api/seed/createAdminUser.js";
import cookieParser from "cookie-parser"
import path from "path"

dotenv.config()

const app = express()
mongoose
  .connect(process.env.MONGO_URI)
  .then(async() => {
    console.log("Connected to MongoDB!");
    await createAdminUser();
  })
  .catch((err) => {
    console.log(err)
  })

const __dirname = path.resolve()

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    "http://localhost:3004",
    "http://localhost:8000",
    "https://gentle-tranquility-production-9ad4.up.railway.app",
  ],
  credentials: true,
}

const PORT = process.env.PORT || 5000

app.use(express.urlencoded({ extended: false }))
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

app.listen(PORT, () => {
  console.log(`Server running on port:${PORT}`)
})

app.use("/api/user", userRouter)
app.use("/api/auth", authRouter)
app.use("/api/test", testRouter)
app.use("/api/document", documentRouter)
app.use("/api/feedback", feedbackRouter)

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Server Error"
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  })
})

/*app.use(express.static(path.join(__dirname, "/frontend/dist")))

app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"))
})*/


