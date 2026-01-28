import mongoose from "mongoose";

const qualificationSchema = new mongoose.Schema(
  {
    degree: { type: String, trim: true },
    institute: { type: String, trim: true },
    year: { type: String, trim: true },
  },
  { _id: false }
);

const tutorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    profileImage: {
      type: String, // Cloudinary / S3 URL
      default: null,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    qualifications: {
      type: [qualificationSchema],
      default: [],
    },

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
      min: 0,
    },

    teachingMode: {
      type: String,
      enum: ["online", "physical", "both"],
      default: "online",
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    certificates: {
      type: [String], // URLs
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
