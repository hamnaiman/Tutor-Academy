import mongoose from "mongoose";

const tutorPostSchema = new mongoose.Schema(
  {
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    grade: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    teachingMode: {
      type: String,
      enum: ["online", "physical", "both"],
      required: true,
    },

    fee: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    availability: {
      type: [String], // e.g. ["Mon-Wed 5pm-7pm", "Weekend Morning"]
      default: [],
    },

    isApproved: {
      type: Boolean,
      default: false, // 🔒 Admin approval required
      index: true,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    rejectedReason: {
      type: String,
      trim: true,
    },

    viewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

/* Prevent duplicate spam posts by same tutor for same subject/grade/city */
tutorPostSchema.index(
  { tutor: 1, subject: 1, grade: 1, city: 1 },
  { unique: false }
);

export default mongoose.model("TutorPost", tutorPostSchema);
