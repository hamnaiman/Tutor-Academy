
import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    studentClass: {
      type: String,
      required: true,
    },
    subjects: {
      type: [String],
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("StudentProfile", studentProfileSchema);
