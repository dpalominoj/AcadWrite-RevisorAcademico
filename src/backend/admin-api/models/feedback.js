import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  documents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }],
  feedbackText: { type: String, required: true },
  qualification: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Feedback", feedbackSchema);
