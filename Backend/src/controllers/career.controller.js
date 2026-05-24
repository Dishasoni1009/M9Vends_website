import Application from "../models/application.model.js";
import { sendCareerNotification } from "../services/mail.service.js";

export const applyCareer = async (req, res) => {
  try {
    const { name, email, phone, resume_drive_url, role } = req.body;

    // Validate input
    if (!name || !email || !phone || !role || !resume_drive_url) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const application = await Application.create({
      name,
      email,
      phone,
      role,
      resume_drive_url,
    });

    // Send email notifications (admin + applicant confirmation)
    try {
      await sendCareerNotification({ name, email, phone, role, resume_drive_url });
    } catch (mailErr) {
      console.error("Career email failed (application still saved):", mailErr.message);
    }

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    });
  } catch (error) {
    console.error("Career Apply Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
