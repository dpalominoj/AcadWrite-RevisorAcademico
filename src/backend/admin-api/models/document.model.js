import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  fileName: String,
  supabasePath: String,
  url: String,
  uploadedAt: { type: Date, default: Date.now },
  isReviewed: { type: Boolean, default: false },
  reviewedAt: { type: Date },
});

export default mongoose.model("Document", DocumentSchema);
