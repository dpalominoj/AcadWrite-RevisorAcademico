// app.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

// Routers
import userRouter from "./admin-api/routes/user.route.js";
import authRouter from "./admin-api/routes/auth.route.js";
import testRouter from "./admin-api/routes/test.route.js";
import documentRouter from "./admin-api/routes/document.route.js";
import feedbackRouter from "./admin-api/routes/feedback.route.js";

// Seed
import { createAdminUser } from "./admin-api/seed/createAdminUser.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// CORS
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
};
app.use(cors(corsOptions));

// Routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/test", testRouter);
app.use("/api/document", documentRouter);
app.use("/api/feedback", feedbackRouter);

// Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Export the app for testing
export default app;

// Function to connect to MongoDB
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB!");
    await createAdminUser();
  } catch (err) {
    console.log(err);
  }
};
