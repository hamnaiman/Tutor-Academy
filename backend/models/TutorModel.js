import mongoose from "mongoose";

const tutorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true, // 📍 student location matching ke liye important
      trim: true,
    },

    qualifications: [
      {
        degree: String,
        institute: String,
        year: String,
      },
    ],

    subjects: {
      type: [String],
      default: [],
    },

    grades: {
      type: [String],
      default: [],
    },

    experienceYears: {
      type: Number,
      default: 0,
    },

    bio: {
      type: String,
      trim: true,
    },

    certificates: {
      type: [String], // file URLs
      default: [],
    },

    isProfileCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("TutorProfile", tutorProfileSchema);
