import mongoose from "mongoose";

const tutorRequestSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tuitionType: {
      type: String,
      enum: ["online", "onsite"],
      required: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    grade: {
      type: String,
      required: true,
      trim: true,
    },
    subjects: {
      type: [String],
      required: true,
    },
    genderPreference: {
      type: String,
      enum: ["male", "female", "any"],
      default: "any",
    },
    experience: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["open", "pending", "assigned", "closed"],
      default: "open",
      index: true,
    },
    assignedTutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("TutorRequest", tutorRequestSchema);
