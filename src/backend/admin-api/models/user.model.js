import mongoose from "mongoose"

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['administrador', 'docente', 'estudiante'],
      default: 'estudiante'
    }
  },
  { timestamp: true }
)

const User = mongoose.model("User", userSchema)
export default User;