import mongoose from "mongoose";
import Notification from "../models/notificationModel.js";
import { sendEmail } from "../utils/email.js";
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
export const notifyTourGuide2 = async (tourGuideId, itineraryName) => {
  try {
    console.log("Creating notification for userId:", tourGuideId); // Debug log

    const message = `Your itinerary "${itineraryName}" has been unflagged by the admin.`;
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
        user: "TravelM8noreply@gmail.com",
        pass: "mgis kukx ozqk dkkn",
      },
    });
    console.log("Email to send notification to:", email);
    const mailOptions = {
      from: "TravelM8noreply@gmail.com",
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
export const sendEmailNotification2 = async (
  email,
  username,
  itineraryName
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "TravelM8noreply@gmail.com",
        pass: "mgis kukx ozqk dkkn",
      },
    });
    console.log("Email to send notification to:", email);
    const mailOptions = {
      from: "TravelM8noreply@gmail.com",
      to: email,
      subject: "Itinerary unFlagged ",
      text: `Dear ${username},\n\nYour itinerary "${itineraryName}" has been unflagged by the admin.\n\nRegards,\nYour System Team`,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.response);
    return { success: true, message: "Email sent successfully." };
  } catch (error) {
    console.error("Error sending email:", error.message);
    return { success: false, error: "Failed to send email." };
  }
};

export const notifyProductOutOfStock = async (product) => {
  try {
    // Send email notification to admin
    const adminEmail = "lailaamr9879@gmail.com";
    const message = `
      <p>Dear Admin,</p>
      <p>The product <b>${product.name}</b> is now out of stock.</p>
      <p>Please take necessary action.</p>
      <p>Best regards,<br>TravelM8</p>
    `;

    await sendEmail(adminEmail, "Product Out of Stock Notification", message); // Use the sendEmail utility

    // Create notification for admin
    const adminUser = await mongoose.model("Admin").findOne({}); // Adjust query as needed
    if (adminUser) {
      await Notification.create({
        userId: adminUser._id,
        type: "product-out-of-stock",
        message: `Product "${product.name}" is out of stock.`,
        isRead: false,
        metadata: {
          productId: product._id,
          productName: product.name,
        },
      });
    }
    console.log("Admin User:", adminUser);
    // Create notification for seller
    console.log("Product Seller ID:", product.sellerId);
    const sellerUser = await mongoose
      .model("Seller")
      .findById(product.sellerId);
    if (sellerUser) {
      await Notification.create({
        userId: sellerUser._id,
        type: "product-out-of-stock",
        message: `Your product "${product.name}" is out of stock.`,
        isRead: false,
        metadata: {
          productId: product._id,
          productName: product.name,
        },
      });
    }
    console.log("Seller User:", sellerUser);
  } catch (error) {
    console.error("Failed to send out of stock notification:", error);
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

    const userId = req.user.userId; // Extract userId from req.user

    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications." });
  }
};

export const sendEmailReminder = async (
  email,
  username,
  itineraryName,
  tourDate
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "TravelM8noreply@gmail.com",
        pass: "mgis kukx ozqk dkkn",
      },
    });

    const formattedDate = new Date(tourDate).toLocaleString();

    const mailOptions = {
      from: "TravelM8noreply@gmail.com",
      to: email,
      subject: "Upcoming Event Reminder",
      text: `Dear ${username},\n\nThis is a reminder for your upcoming event "${itineraryName}" scheduled on ${formattedDate}.\n\nWe look forward to seeing you there!\n\nRegards,\nYour System Team`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);

    return { success: true, message: "Email reminder sent successfully." };
  } catch (error) {
    console.error("Error sending email reminder:", error.message);
    return { success: false, error: "Failed to send email reminder." };
  }
};

export const sendEmailReminder2 = async (email, subject, body) => {
  // Create the transporter inside the function
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "TravelM8noreply@gmail.com",
      pass: "mgis kukx ozqk dkkn",
    },
  });

  try {
    const info = await transporter.sendMail({
      from: "TravelM8noreply@gmail.com", // Sender address
      to: email, // Recipient address
      subject: subject, // Subject line
      html: body, // HTML body of the email
    });

    console.log("Email sent: " + info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};

export const markNotificationAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    res
      .status(200)
      .json({ message: "Notification marked as read.", notification });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Error marking notification as read." });
  }
};

export const deleteNotification = async (req, res) => {
  const { id } = req.params;
  try {
    await Notification.findByIdAndDelete(id);
    res.status(200).json({ message: "Notification deleted." });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Error deleting notification." });
  }
};
export const clearNotifications = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      console.error("User not authenticated or user ID not found.");
      return res
        .status(403)
        .json({ message: "Unauthorized access. User not found." });
    }

    const result = await Notification.deleteMany({ userId: req.user.userId });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "No notifications found for this user." });
    }

    res.status(200).json({ message: "All notifications cleared." });
  } catch (error) {
    console.error("Error clearing notifications:", error);
    res
      .status(500)
      .json({ message: "Error clearing notifications.", error: error.message });
  }
};

export const notifyTouristBirthdayPromo = async (touristId, promoCode) => {
  try {
    const message = `Happy Birthday! Use the promo code ${promoCode} to get a discount on your next purchase!`;
    const notification = await Notification.create({
      userId: touristId,
      message,
      type: "birthday-promo-code",
      isRead: false,
    });

    console.log("Notification created successfully:", notification);
    return { success: true, message: "Notification created successfully." };
  } catch (error) {
    console.error("Error creating notification:", error.message);
    return { success: false, error: "Failed to create notification." };
  }
};
