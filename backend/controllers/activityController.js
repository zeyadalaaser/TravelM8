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
  // Validate the location field
  const isLocationValid =
    typeof location === "object" &&
    location !== null &&
    typeof location.lat === "number" &&
    typeof location.lng === "number";

  if (
    mongoose.Types.ObjectId.isValid(category) &&
    Array.isArray(tags) &&
    tags.every((tag) => mongoose.Types.ObjectId.isValid(tag)) && // Check each tag in the array
    isLocationValid // Ensure advertiserId is valid
  ) {
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
    res.status(400).json({ message: "bad parameters" });
  }
};

export const createManualActivity = async (req, res) => {
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
    advertiserId,
  } = req.body;

  // Print the incoming request body
  console.log("Incoming request body:", req.body);
  console.log(location);
  // Validate the location field
  const isLocationValid = 
    //typeof location === "object";  //&&
    location !== null &&
    typeof location.lat === "number" &&
    typeof location.lng === "number" ;
  //   // // typeof location.name === "string";

  // console.log("Location valid:", isLocationValid);

  // Validate other fields
  const isCategoryValid = mongoose.Types.ObjectId.isValid(category);
  console.log("Category valid:", isCategoryValid);

  const areTagsValid = Array.isArray(tags) && tags.every((tag) => {
    const isValid = mongoose.Types.ObjectId.isValid(tag);
    console.log(`Tag "${tag}" valid:`, isValid);
    return isValid;
  });
  
  console.log("Tags valid:", areTagsValid);

  const isAdvertiserIdValid = mongoose.Types.ObjectId.isValid(advertiserId);
  console.log("Advertiser ID valid:", isAdvertiserIdValid);

  if (isCategoryValid && areTagsValid && isAdvertiserIdValid && isLocationValid) {
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
      advertiserId,
    });

    try {
      const createdActivity = await newActivity.save();
      await createdActivity.populate("advertiserId", "username");

      return res.status(201).json({
        message: "Successfully created new activity",
        createdActivity,
      });
    } catch (error) {
      console.error("Error creating activity:", error); // Log the error for debugging
      return res.status(400).json({ message: "Unsuccessful creation of activity" });
    }
  } else {
    console.log("Validation failed:");
    if (!isCategoryValid) {
      console.log("Invalid category:", category);
    }
    if (!areTagsValid) {
      console.log("Invalid tags:", tags);
    }
    if (!isAdvertiserIdValid) {
      console.log("Invalid advertiser ID:", advertiserId);
    }
    if (!isLocationValid) {
      console.log("Invalid location:", location);
    }

    return res.status(400).json({ message: "Bad parameters" });
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

const getMyActivities = async (req, res) => {
  // Ensure user is authenticated and has a valid userId
  console.log(req.user);

  if (!req.user || !req.user.userId) {
    return res.status(401).json({ message: "Unauthorized: User ID missing." });
  }
  const userId = req.user.userId;
  console.log("Advertiser ID:", userId);


  try {
    console.log("Searching for activities with advertiserId:", userId);

    // Fetch activities and populate related fields
    const activities = await activityModel
      .find({ advertiserId: userId })
      .populate("advertiserId", "username")
      .populate("category", "name")
      .populate("tags", "name");

    // Return empty array if no activities found
    if (activities.length === 0) {
      return res
        .status(200)
        .json({ activities: [], message: "No activities found for this advertiser." });
    }

    console.log("Fetched Activities:", activities);

    // Successful response
    return res.status(200).json({ activities });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return res.status(500).json({ message: "Server error, please try again later." });
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
  getMyActivities,
  deleteActivity,
};
