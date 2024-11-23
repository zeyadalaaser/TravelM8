import Notification from "../models/notificationModel.js";
import nodemailer from "nodemailer";

// Notify via system notification
export const notifyTourGuide = async (tourGuideId, itineraryName) => {
  try {
    console.log("Creating notification for userId:", tourGuideId); // Debug log

    const message = `Your itinerary "${itineraryName}" has been flagged as inappropriate by the admin.`;
    const notification = await Notification.create({
      userId: tourGuideId,
      message,
    });

    console.log("Notification created successfully:", notification); // Debug log
    return { success: true, message: "Notification created successfully." };
  } catch (error) {
    console.error("Error creating notification:", error.message);
    return { success: false, error: "Failed to create notification." };
  }
};

// Notify via email
export const sendEmailNotification = async (email, username, itineraryName) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mennayehiahassan@gmail.com", // Replace with your email
        pass: "dsbkyetgxkynwbpz", // Replace with app password
      },
    });
    console.log("Email to send notification to:", email);
    const mailOptions = {
      from: "mennayehiahassan@gmail.com",
      to: email,
      subject: "Itinerary Flagged as Inappropriate",
      text: `Dear ${username},\n\nYour itinerary "${itineraryName}" has been flagged as inappropriate by the admin.\n\nPlease review the flagged itinerary and contact support if needed.\n\nRegards,\nYour System Team`,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.response);
    return { success: true, message: "Email sent successfully." };
  } catch (error) {
    console.error("Error sending email:", error.message);
    return { success: false, error: "Failed to send email." };
  }
};

export const getNotifications = async (req, res) => {
  try {
    console.log("req.user:", req.user); // Log the user data

    if (!req.user || !req.user.userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized access. User not found." });
    }

    const notifications = await Notification.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications." });
  }
};
