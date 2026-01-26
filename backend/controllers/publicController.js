import TutorRequirement from "../models/TutorRequirement.js";

export const publicRequirements = async (req, res) => {
  const data = await TutorRequirement.find({ isActive: true })
    .populate("student", "name")
    .sort({ createdAt: -1 });

  res.json(data);
};
