import express from "express"
import { signin, signout, signup, signupStudent } from "../controllers/auth.controller.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/signup-student", signupStudent)
router.post("/signin", signin)
router.post("/signout", signout)

export default router
