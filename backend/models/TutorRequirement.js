import mongoose from "mongoose";

const tutorRequirementSchema = new mongoose.Schema(
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

    area: {
      type: String,
      trim: true,
    },

    grade: {
      type: String,
      required: true,
    },

    subjects: {
      type: [String],
      required: true,
    },

    preferredTutorGender: {
      type: String,
      enum: ["male", "female", "any"],
      default: "any",
    },

    requiredExperience: {
      type: Number,
      default: 0,
    },

    description: {
      type: String,
      maxlength: 500,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("TutorRequirement", tutorRequirementSchema);
