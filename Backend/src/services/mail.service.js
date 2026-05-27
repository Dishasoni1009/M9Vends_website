// src/services/mail.service.js
import nodemailer from "nodemailer";
import { ENV } from "../config/env.js";

// Create reusable transporter using Gmail SMTP + App Password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ENV.MAIL_USER,
    pass: ENV.MAIL_PASS,
  },
});

/**
 * Send an email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - Email body (HTML)
 */
export const sendMail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"M9Vends" <${ENV.MAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("Email send failed:", error.message);
    throw error;
  }
};

/**
 * Notify admin about a new contact form submission
 */
export const sendContactNotification = async ({ name, email, phone, subject, message }) => {
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a1a2e; border-bottom: 2px solid #e94560; padding-bottom: 10px;">
        📩 New Contact Form Submission
      </h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <tr><td style="padding: 8px; font-weight: bold; color: #555;">Name</td><td style="padding: 8px;">${name}</td></tr>
        <tr style="background: #f8f9fa;"><td style="padding: 8px; font-weight: bold; color: #555;">Email</td><td style="padding: 8px;">${email}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; color: #555;">Phone</td><td style="padding: 8px;">${phone || "N/A"}</td></tr>
        <tr style="background: #f8f9fa;"><td style="padding: 8px; font-weight: bold; color: #555;">Subject</td><td style="padding: 8px;">${subject}</td></tr>
      </table>
      <div style="margin-top: 15px; padding: 15px; background: #f8f9fa; border-left: 4px solid #e94560; border-radius: 4px;">
        <strong>Message:</strong><br/>${message}
      </div>
    </div>
  `;

  const userHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a1a2e;">Thanks for reaching out, ${name}! 👋</h2>
      <p style="color: #555; line-height: 1.6;">
        We've received your message and our team will get back to you within <strong>24-48 hours</strong>.
      </p>
      <div style="margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
        <p style="margin: 0; color: #777;"><strong>Your message:</strong></p>
        <p style="margin: 8px 0 0; color: #555;">${message}</p>
      </div>
      <p style="margin-top: 20px; color: #999; font-size: 13px;">
        — Team M9Vends
      </p>
    </div>
  `;

  // Send to admin
  await sendMail(ENV.MAIL_USER, `New Contact: ${subject}`, adminHtml);

  // Send confirmation to user
  if (email) {
    await sendMail(email, "We received your message — M9Vends", userHtml);
  }
};

/**
 * Notify admin about a new career application + send confirmation to applicant
 */
export const sendCareerNotification = async ({ name, email, phone, role, resume_drive_url }) => {
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a1a2e; border-bottom: 2px solid #0f3460; padding-bottom: 10px;">
        💼 New Job Application
      </h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <tr><td style="padding: 8px; font-weight: bold; color: #555;">Name</td><td style="padding: 8px;">${name}</td></tr>
        <tr style="background: #f8f9fa;"><td style="padding: 8px; font-weight: bold; color: #555;">Email</td><td style="padding: 8px;">${email}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; color: #555;">Phone</td><td style="padding: 8px;">${phone}</td></tr>
        <tr style="background: #f8f9fa;"><td style="padding: 8px; font-weight: bold; color: #555;">Role Applied</td><td style="padding: 8px; font-weight: bold; color: #0f3460;">${role}</td></tr>
      </table>
      <div style="margin-top: 15px;">
        <a href="${resume_drive_url}" style="display: inline-block; padding: 10px 20px; background: #0f3460; color: #fff; text-decoration: none; border-radius: 6px;">
          📄 View Resume
        </a>
      </div>
    </div>
  `;

  const userHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a1a2e;">Application Received! 🎉</h2>
      <p style="color: #555; line-height: 1.6;">
        Hi <strong>${name}</strong>, thanks for applying for the <strong>${role}</strong> position at M9Vends.
      </p>
      <p style="color: #555; line-height: 1.6;">
        Our team will review your application and reach out if your profile matches our requirements.
      </p>
      <div style="margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
        <p style="margin: 0; color: #777;"><strong>Application Summary:</strong></p>
        <ul style="color: #555; line-height: 1.8;">
          <li><strong>Position:</strong> ${role}</li>
          <li><strong>Resume:</strong> <a href="${resume_drive_url}">View submitted resume</a></li>
        </ul>
      </div>
      <p style="margin-top: 20px; color: #999; font-size: 13px;">
        — HR Team, M9Vends
      </p>
    </div>
  `;

  // Send to admin
  await sendMail(ENV.MAIL_USER, `New Application: ${role} — ${name}`, adminHtml);

  // Send confirmation to applicant
  if (email) {
    await sendMail(email, `Application Received — ${role} at M9Vends`, userHtml);
  }
};
