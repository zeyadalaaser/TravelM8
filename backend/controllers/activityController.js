import activityModel from "../models/activityModel.js";
import mongoose from "mongoose";
import { getActivities } from "../services/activities/activityServices.js";
import Activity from "../models/activityModel.js";

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
            await activityModel.create(newActivity);
            res.status(201).json({ message: "successfully created new activity", newActivity });
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

const getActivityById = async (req, res) => {
    const activityId = req.params.id;
    if (mongoose.Types.ObjectId.isValid(activityId)) {
        try {
            const activity = await activityModel.findById(activityId);
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
            Object.entries(req.body).filter(([key, value]) => value != null));
        try {
            const newActivity = await Activity.findByIdAndUpdate(
                activityId,
                { $set: updateFields },
                { new: true, runValidators: true } // Return updated user and apply validation
            );
            res.status(200).json({ message: "successfully updated the activity", newActivity });

        } catch (error) {
            res.status(400).json({ message: "enter a valid data" });
        }
    } else {
        res.status(400).json({ message: "enter a valid id" });
    }
}

//advertiser only
const getMyActivities = async (req, res) => {
    let activities;
    if (user.type === "advertiser") {
        activities = await activityModel.find({ advertiserId: user.id });
        if (activity.length == 0)
            res.status(204);
        else
            res.status(200).json({ activity });
    } else {
        res.status(400).json({ message: "enter a valid id" });
    }
}

const deleteActivity = async (req, res) => {
    const activityId = req.params.id;
    if (mongoose.Types.ObjectId.isValid(activityId)) {
        try {
            const activityDeleted = await activityModel.findByIdAndDelete(activityId);
            res.status(200).json({ message: "Activity successfully deleted", activityDeleted});
        } catch (error) {
            res.status(400).json({ message: "unseuccessful deletion of activity" });

        }
    } else {
        res.status(400).json({ message: "enter a valid id" });
    }
}

export { createNewActivity, getAllActivities, getActivityById, updateActivity, getMyActivities, deleteActivity };