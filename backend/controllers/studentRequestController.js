import TutorRequest from "../models/TutorRequest.js";

/* ================= CREATE TUTOR REQUEST ================= */
export const createTutorRequest = async (req, res) => {
  try {
    const { tuitionType, city, grade, subjects, genderPreference, experience, notes } = req.body;

    if (!tuitionType || !city || !grade || !subjects?.length) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const request = await TutorRequest.create({
      student: req.user._id,
      tuitionType,
      city,
      grade,
      subjects,
      genderPreference,
      experience,
      notes,
      status: "open", // open, pending, accepted, closed
    });

    res.status(201).json({ success: true, request });
  } catch (err) {
    console.error("Create Tutor Request Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET ALL STUDENT REQUESTS ================= */
export const getMyRequests = async (req, res) => {
  try {
    const { status } = req.query; // optional filter: open, pending, accepted, closed

    const filter = { student: req.user._id };
    if (status) filter.status = status;

    const requests = await TutorRequest.find(filter)
      .populate("assignedTutor", "name email phone")
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (err) {
    console.error("Get My Requests Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= UPDATE / EDIT REQUEST ================= */
export const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { tuitionType, city, grade, subjects, genderPreference, experience, notes } = req.body;

    const request = await TutorRequest.findOne({ _id: id, student: req.user._id, status: "open" });
    if (!request) return res.status(404).json({ message: "Request not found or already processed" });

    if (tuitionType) request.tuitionType = tuitionType;
    if (city) request.city = city;
    if (grade) request.grade = grade;
    if (subjects?.length) request.subjects = subjects;
    if (genderPreference) request.genderPreference = genderPreference;
    if (experience) request.experience = experience;
    if (notes) request.notes = notes;

    await request.save();
    res.json({ success: true, request });
  } catch (err) {
    console.error("Update Request Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= DELETE REQUEST ================= */
export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await TutorRequest.findOne({ _id: id, student: req.user._id });
    if (!request) return res.status(404).json({ message: "Request not found" });

    await request.remove();
    res.json({ success: true, message: "Request deleted" });
  } catch (err) {
    console.error("Delete Request Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
