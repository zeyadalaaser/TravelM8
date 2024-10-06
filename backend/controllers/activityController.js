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
        advertiserId, //=> add its logic from idk the session or sum
    } = req.body;

    if (
        mongoose.Types.ObjectId.isValid(category) &&
        Array.isArray(tags) && tags.every(tag => mongoose.Types.ObjectId.isValid(tag)) && // Check each tag in the array
        mongoose.Types.ObjectId.isValid(advertiserId)
    ) {
        const newActivity = {
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
            advertiserId
        };


        try {
            const createdActivity = await activityModel.create(newActivity).populate('advertiserId','username');
            res.status(201).json({ message: "successfully created new activity", createdActivity });
        } catch (error) {
            res.status(400).json({ message: "unsuccessful creation of activity" });
        }

    }else {
        res.status(400).json({ message: "bad parameters" });

    }

}

const getAllActivities = async (req, res) => {
    res.status(200).json(await getActivities(req.query, {}));
}

const getActivityById = async(req,res) => {
    const activityId = req.params.id;
    if (mongoose.Types.ObjectId.isValid(activityId)) {
        try {
            const activity = await activityModel.findById(activityId)
                .populate('advertiserId','username')
                .populate('category','name')
                .populate('tags','name');
            if (activity.length == 0)
                res.status(204);
            else
                res.status(200).json({ activity });
        } catch {
            res.status(400).json({ message: "enter a valid id" });
        }
    } else {
        res.status(400).json({ message: "enter a valid id" });
    }

}

const updateActivity = async (req, res) => {
    const activityId = req.params.id;

    if (mongoose.Types.ObjectId.isValid(activityId)) {
        const updateFields = Object.fromEntries(
            Object.entries(req.body).filter(([key, value]) => value != null)
        );
        
        try {
            // Ensure category is a valid ObjectId (if you're updating it)
            if (updateFields.category && !mongoose.Types.ObjectId.isValid(updateFields.category)) {
                return res.status(400).json({ message: "Invalid category ID" });
            }

            // Update the activity
            const newActivity = await activityModel.findByIdAndUpdate(
                activityId,
                { $set: updateFields },
                { new: true, runValidators: true } // Return updated document and apply validation
            )
            .populate('advertiserId', 'username')
            .populate('category', 'name')
            .populate('tags', 'name');

            // Check if the activity was updated
            if (!newActivity) {
                return res.status(404).json({ message: "Activity not found" });
            }

            // Return success response
            res.status(200).json({ message: "Successfully updated the activity", newActivity });
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: "Failed to update activity", error });
        }
    } else {
        res.status(400).json({ message: "Invalid activity ID" });
    }
};

//advertiser only
const getMyActivities = async (req, res) => {
    const { advertiserId } = req.body; // logic of "my"
    console.log(advertiserId);
    if (mongoose.Types.ObjectId.isValid(advertiserId)) {
        try{
            const activities = await activityModel.find({ advertiserId: advertiserId})
                .populate('advertiserId','username')
                .populate('category','name')
                .populate('tags','name');
            
            res.status(200).json({ activities });
        }catch(error){
            res.status(406).json({ message: error.message });
        }
    } else {
        res.status(408).json({ message: "enter a valid id" });
    }
}

const deleteActivity = async (req, res) => {
    const activityId = req.params.id;
    if (mongoose.Types.ObjectId.isValid(activityId)) {
        try {
            const activityDeleted = await activityModel.findByIdAndDelete(activityId)
            .populate('advertiserId','username')
            .populate('category','name')
            .populate('tags','name');
        if (activity.length == 0)
            res.status(200).json({ message: "Activity successfully deleted", activityDeleted});
        } catch (error) {
            res.status(400).json({ message: "unseuccessful deletion of activity" });

        }
    } else {
        res.status(400).json({ message: "enter a valid id" });
    }
}

export { createNewActivity, getAllActivities, getActivityById, updateActivity, getMyActivities, deleteActivity };