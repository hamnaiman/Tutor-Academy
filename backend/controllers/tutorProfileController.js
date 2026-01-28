import TutorProfile from "../models/TutorModel.js";

/**
 * ===============================
 * GET Tutor Profile
 * GET /api/tutor/profile
 * ===============================
 */
export const getTutorProfile = async (req, res) => {
  try {
    const profile = await TutorProfile.findOne({ user: req.user._id })
      .populate("user", "name email role isApproved");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Tutor profile not found",
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get Tutor Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * ===============================
 * UPDATE Tutor Profile
 * PUT /api/tutor/profile
 * ===============================
 */
export const updateTutorProfile = async (req, res) => {
  try {
    const profile = await TutorProfile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Tutor profile not found",
      });
    }

    // 🔐 Allowed fields only (security best practice)
    const allowedFields = [
      "phone",
      "city",
      "qualifications",
      "subjects",
      "grades",
      "experienceYears",
      "teachingMode",
      "bio",
      "certificates",
      "profileImage",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    });

    // ✅ Mark profile completed once updated
    profile.isProfileCompleted = true;

    await profile.save();

    res.status(200).json({
      success: true,
      message: "Tutor profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("Update Tutor Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * ===============================
 * DELETE Tutor Profile Item (Partial)
 * DELETE /api/tutor/profile/item
 *
 * type:
 *  - qualification
 *  - certificate
 *  - subject
 *  - profileImage
 * ===============================
 */
export const deleteTutorProfileItem = async (req, res) => {
  try {
    const { type, value } = req.body;

    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Delete type is required",
      });
    }

    const profile = await TutorProfile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Tutor profile not found",
      });
    }

    switch (type) {
      case "qualification":
        profile.qualifications = profile.qualifications.filter(
          (q) => q.degree !== value
        );
        break;

      case "certificate":
        profile.certificates = profile.certificates.filter(
          (c) => c !== value
        );
        break;

      case "subject":
        profile.subjects = profile.subjects.filter(
          (s) => s !== value
        );
        break;

      case "profileImage":
        profile.profileImage = null;
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Invalid delete type",
        });
    }

    await profile.save();

    res.status(200).json({
      success: true,
      message: "Profile item removed successfully",
      profile,
    });
  } catch (error) {
    console.error("Delete Tutor Profile Item Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
