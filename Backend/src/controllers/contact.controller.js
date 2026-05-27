import Contact from "../models/contact.model.js";
import { sendContactNotification } from "../services/mail.service.js";

export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, subject, and message are required",
      });
    }

    const data = await Contact.create({ name, email, phone, subject, message });

    // Send email notifications (admin + user confirmation)
    try {
      await sendContactNotification({ name, email, phone, subject, message });
    } catch (mailErr) {
      console.error("Contact email failed (form still saved):", mailErr.message);
    }

    res.status(201).json({
      success: true,
      message: "Contact submitted successfully",
      data,
    });
  } catch (error) {
    console.error("Contact Submit Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
