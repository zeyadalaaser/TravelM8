import activityModel from "../models/activityModel.js";
import mongoose from "mongoose";
import { getActivities } from "../services/activities/activityServices.js";


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
    const areTagsValid = Array.isArray(tags) && tags.every((tag) => mongoose.Types.ObjectId.isValid(tag));
    const isInputValid = isCategoryValid && areTagsValid && isLocationValid;
    
    
  if ( isInputValid ) // Ensure advertiserId is valid
  {
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
      advertiserId : advertiserId,
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

export const getActivityPrice = async (activityId) =>{
  try{
    const activity = await activityModel.findById(activityId);
    if(Array.isArray(activity.price))
      return activity.price[0];
    else
    return activity.price;
  }catch(error){
    return null;
  }
};


const updateActivity = async (req,res) => {
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
      res.status(200).json({ message: "Successfully updated the activity", updatedActivity });
      }catch(error){
        console.error(error);
        res.status(400).json({ message: "Failed to update activity", error });
      }
    }
    else{
      res.status(400).json({ message: "Invalid activity ID" });
    }
};

export const getMyActivities = async (req, res) => {

  try {
    const advertiserId = req.user.userId;
    if (!mongoose.Types.ObjectId.isValid(advertiserId)) {
      return res.status(404).json({ message: "Enter a valid id" });
    }
    const activities = await activityModel.find({ advertiserId })
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
        res.status(200).json({ message: "Activity successfully deleted", activityDeleted });
    } catch (error) {
      res.status(400).json({ message: "unseuccessful deletion of activity" });
    }
  } else {
    res.status(400).json({ message: "enter a valid id" });
  }
};

export {
  createNewActivity,
  getAllActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
};
