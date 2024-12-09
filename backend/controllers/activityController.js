import activityModel from "../models/activityModel.js";
import mongoose from "mongoose";
import { getActivities } from "../services/activities/activityServices.js";
import nodemailer from "nodemailer";
import Notification from "../models/notificationModel.js";

const createNewActivity = async (req, res) => {
  const {
    title,
    description,
    date,
    location,
    price,
    category,
    tags,
    discount,
    isBookingOpen,
    image,
  } = req.body;

  const advertiserId = req.user.userId;
  console.log("Location:", location);
  console.log("lat type:", typeof location.lat, "value:", location.lat);
  console.log("lng type:", typeof location.lng, "value:", location.lng);
  // Validate the location field
  const isLocationValid = (location) => {
    return (
      location !== null &&
      typeof location === "object" &&
      !isNaN(parseFloat(location.lat)) &&
      !isNaN(parseFloat(location.lng))
    );
  };

  console.log(location);
  const isCategoryValid = mongoose.Types.ObjectId.isValid(category);
  const areTagsValid =
    Array.isArray(tags) &&
    tags.every((tag) => mongoose.Types.ObjectId.isValid(tag));
  const isInputValid = isCategoryValid && areTagsValid && isLocationValid;

  if (isInputValid) {
    // Ensure advertiserId is valid
    const newActivity = new activityModel({
      title,
      description,
      date,
      location,
      price,
      category,
      tags,
      discount,
      isBookingOpen,
      image,
      advertiserId: advertiserId,
    });

    try {
      const createdActivity = await newActivity.save();
      await createdActivity.populate("advertiserId", "username");

      res.status(201).json({
        message: "successfully created new activity",
        createdActivity,
      });
    } catch (error) {
      res.status(400).json({ message: "unsuccessful creation of activity" });
    }
  } else {
    console.error({ isCategoryValid, areTagsValid, isLocationValid });

    res.status(400).json({ message: "bad parameters" });
  }
};

const getAllActivities = async (req, res) => {
  res.status(200).json(await getActivities(req.query, {}));
};

const getActivities2 = async (req, res) => {
  try {
    // Fetch all activities from the database
    const activities = await activityModel
      .find({}) // No filters applied
      .populate("advertiserId", "username") // Populate advertiser details
      .populate("category", "name") // Populate category details
      .populate("tags", "name"); // Populate tag details

    if (activities.length === 0) {
      return res.status(404).json({ message: "No activities found" });
    }

    // Return all activities
    res.status(200).json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error.message);
    res.status(500).json({ message: "Failed to fetch activities", error });
  }
};

const getActivityById = async (req, res) => {
  const activityId = req.params.id;
  if (mongoose.Types.ObjectId.isValid(activityId)) {
    try {
      const activity = await activityModel
        .findById(activityId)
        .populate("advertiserId", "username")
        .populate("category", "name")
        .populate("tags", "name");
      if (activity.length == 0) res.status(204);
      else res.status(200).json({ activity });
    } catch {
      res.status(400).json({ message: "enter a valid id" });
    }
  } else {
    res.status(400).json({ message: "enter a valid id" });
  }
};

export const getActivityPrice = async (activityId) => {
  try {
    const activity = await activityModel.findById(activityId);
    if (Array.isArray(activity.price)) return activity.price[0];
    else return activity.price;
  } catch (error) {
    return null;
  }
};

const updateActivity = async (req, res) => {
  const activityId = req.params.id;
  const updatedFields = req.body;

  if (mongoose.Types.ObjectId.isValid(activityId)) {
    try {
      const updatedActivity = await activityModel
        .findByIdAndUpdate(
          activityId,
          updatedFields,
          { new: true, runValidators: true } // Return updated document and apply validation
        )
        .populate("advertiserId", "username")
        .populate("category", "name")
        .populate("tags", "name");

      // Check if the activity was updated
      if (!updatedActivity) {
        return res.status(404).json({ message: "Activity not found" });
      }
      // Return success response
      res.status(200).json({
        message: "Successfully updated the activity",
        updatedActivity,
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Failed to update activity", error });
    }
  } else {
    res.status(400).json({ message: "Invalid activity ID" });
  }
};

export const getMyActivities = async (req, res) => {
  try {
    const advertiserId = req.user.userId;
    if (!mongoose.Types.ObjectId.isValid(advertiserId)) {
      return res.status(404).json({ message: "Enter a valid id" });
    }
    const activities = await activityModel
      .find({ advertiserId })
      .populate("advertiserId", "username")
      .populate("category", "name")
      .populate("tags", "name");
    if (activities.length == 0)
      return res.status(404).json({ message: "no activities found" });
    else return res.status(200).json(activities);
  } catch (error) {
    return res.status(400).json({ message: "Error", error: error.message });
  }
};

const deleteActivity = async (req, res) => {
  const activityId = req.params.id;
  if (mongoose.Types.ObjectId.isValid(activityId)) {
    try {
      const activityDeleted = await activityModel
        .findByIdAndDelete(activityId)
        .populate("advertiserId", "username")
        .populate("category", "name")
        .populate("tags", "name");
      res
        .status(200)
        .json({ message: "Activity successfully deleted", activityDeleted });
    } catch (error) {
      res.status(400).json({ message: "unseuccessful deletion of activity" });
    }
  } else {
    res.status(400).json({ message: "enter a valid id" });
  }
};
const flagActivity = async (req, res) => {
  const activityId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(activityId)) {
    return res.status(400).json({ message: "Invalid activity ID" });
  }

  try {
    const activity = await activityModel
      .findByIdAndUpdate(activityId, { flagged: true }, { new: true })
      .populate("advertiserId", "email username");

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Email notification
    if (activity.advertiserId) {
      const { email, username } = activity.advertiserId;
      const activityTitle = activity.title;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "TravelM8noreply@gmail.com",
          pass: "mgis kukx ozqk dkkn",
        },
      });

      const mailOptions = {
        from: "TravelM8noreply@gmail.com",
        to: email,
        subject: "Activity Flagged Notification",
        text: `Dear ${username},\n\nYour activity "${activityTitle}" has been flagged by the admin. Please review the flagged activity and contact support if needed.\n\nRegards,\nYour System Team`,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Flagging email sent to ${email}`);
    }

    // System notification
    if (activity.advertiserId) {
      const notificationMessage = `Your activity "${activity.title}" has been flagged by the admin.`;
      await Notification.create({
        userId: activity.advertiserId._id,
        message: notificationMessage,
      });
      console.log("System notification created for flagged activity.");
    }

    res
      .status(200)
      .json({ message: "Activity flagged successfully", activity });
  } catch (error) {
    console.error("Error flagging activity:", error);
    res.status(500).json({ message: "Error flagging activity", error });
  }
};
const unflagActivity = async (req, res) => {
  const activityId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(activityId)) {
    return res.status(400).json({ message: "Invalid activity ID" });
  }

  try {
    const activity = await activityModel
      .findByIdAndUpdate(activityId, { flagged: false }, { new: true })
      .populate("advertiserId", "email username");

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Email notification
    if (activity.advertiserId) {
      const { email, username } = activity.advertiserId;
      const activityTitle = activity.title;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "TravelM8noreply@gmail.com", // Replace with your email
          pass: "mgis kukx ozqk dkkn", // Replace with app password
        },
      });

      const mailOptions = {
        from: "TravelM8noreply@gmail.com",
        to: email,
        subject: "Activity Unflagged Notification",
        text: `Dear ${username},\n\nYour activity "${activityTitle}" has been unflagged by the admin. It is now visible again on the platform.\n\nRegards,\nYour System Team`,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Unflagging email sent to ${email}`);
    }

    // System notification
    if (activity.advertiserId) {
      const notificationMessage = `Your activity "${activity.title}" has been unflagged by the admin.`;
      await Notification.create({
        userId: activity.advertiserId._id,
        message: notificationMessage,
      });
      console.log("System notification created for unflagged activity.");
    }

    res
      .status(200)
      .json({ message: "Activity unflagged successfully", activity });
  } catch (error) {
    console.error("Error unflagging activity:", error);
    res.status(500).json({ message: "Error unflagging activity", error });
  }
};

export {
  createNewActivity,
  getAllActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
  flagActivity,
  getActivities2,
  unflagActivity,
};
