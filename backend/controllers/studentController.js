import TutorProfile from "../models/TutorModel.js";
import TutorRequest from "../models/TutorRequest.js";

/* ================= SEARCH & VIEW TUTORS ================= */
export const getAllTutors = async (req, res) => {
  try {
    const filters = {};

    if (req.query.city) filters.city = req.query.city;
    if (req.query.subject) filters.subjects = { $in: [req.query.subject] };
    if (req.query.grade) filters.grades = { $in: [req.query.grade] };
    if (req.query.feeMin || req.query.feeMax) {
      filters.fee = {};
      if (req.query.feeMin) filters.fee.$gte = Number(req.query.feeMin);
      if (req.query.feeMax) filters.fee.$lte = Number(req.query.feeMax);
    }
    if (req.query.onlineOnly) filters.online = req.query.onlineOnly === "true";

    const tutors = await TutorProfile.find(filters)
      .populate("user", "name email phone")
      .sort({ experienceYears: -1 }); // most experienced first

    res.json({ success: true, tutors });
  } catch (err) {
    console.error("Get All Tutors Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= SEND REQUEST TO TUTOR ================= */
export const sendRequestToTutor = async (req, res) => {
  try {
    const { tutorId, requestId } = req.params;

    // Find the student's request to assign
    const request = await TutorRequest.findOne({ _id: requestId, student: req.user._id, status: "open" });
    if (!request) return res.status(404).json({ message: "Request not found or already processed" });

    const tutor = await TutorProfile.findById(tutorId);
    if (!tutor) return res.status(404).json({ message: "Tutor not found" });

    request.assignedTutor = tutorId;
    request.status = "pending"; // waiting for tutor confirmation
    await request.save();

    res.json({ success: true, message: "Request sent to tutor", request });
  } catch (err) {
    console.error("Send Request to Tutor Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
