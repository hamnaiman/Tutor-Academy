import TutorRequest from "../models/TutorRequest.js";

/**
 * Tutor sends interest on a student request
 * POST /api/tutor/requests/send
 */
export const sendTutorRequest = async (req, res) => {
  try {
    const { requestId } = req.body;

    if (!requestId) {
      return res.status(400).json({ message: "Request ID is required" });
    }

    // Check tutor is approved and not blocked
    if (!req.user.isApproved || req.user.isBlocked) {
      return res.status(403).json({ message: "You are not authorized to send requests" });
    }

    const request = await TutorRequest.findById(requestId);

    if (!request || request.status !== "open") {
      return res.status(400).json({ message: "Invalid or closed request" });
    }

    // Update request
    request.status = "pending";
    request.assignedTutor = req.user._id;
    await request.save();

    res.json({
      success: true,
      message: "Request sent to student",
      requestId: request._id,
      studentId: request.student,
    });
  } catch (error) {
    console.error("Send Tutor Request Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
