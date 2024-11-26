import mongoose from "mongoose";
import BookingActivity from "../models/bookingsActivityModel.js";
import Activity from "../models/activityModel.js";
import { updatePoints } from "./touristController.js";
import { getActivityPrice } from "./activityController.js";

// Booking an activity
export const createBooking = async (req, res) => {
  const { activityId, price, paymentMethod } = req.body;
  const touristId = req.user.userId;
  console.log(activityId, touristId);

  if (!touristId || !activityId) {
    return res
      .status(400)
      .json({ message: "Tourist ID and Activity ID are required." });
  }

  try {
    // Find the activity and check if it exists
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found." });
    }

    // Check if booking is open for this activity
    if (!activity.isBookingOpen) {
      return res
        .status(400)
        .json({ message: "Booking is not open for this activity." });
    }

    // Create a new booking
    const newBooking = new BookingActivity({
      touristId,
      activityId,
      bookingDate: new Date(),
      status: "Paid",
      price,
      paymentMethod
    });

    await newBooking.save();
    const activityPrice = await getActivityPrice(activityId);
    if (activityPrice) {
      const { points, current } = await updatePoints(touristId, activityPrice);
      return res
        .status(201)
        .json({
          message: `Activity booked successfully. You gained ${points} points and currently have ${current} loyality points`,
          booking: newBooking,
        });
    } else
      return res
        .status(400)
        .json({ message: "Error reading the activity price." });
  } catch (error) {
    console.error("Error booking activity:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getAllActivityBookings = async (req, res) => {
  try {
    const touristId = req.user.userId;
    const allBookings = await BookingActivity.find({
      touristId: touristId,
    }).populate("activityId");
    res
      .status(201)
      .json({
        allBookings,
        message: "Successfully fetched all your activity bookings!",
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    // const touristId = req.user.userId;
    const bookingId = req.params.id;
    const bookingToCancel = await BookingActivity.findById(bookingId).populate(
      "activityId"
    );

    const currentDate = new Date();
    const slotDateObj = new Date(bookingToCancel.activityId.date);

    const hoursDifference = (slotDateObj - currentDate) / (1000 * 60 * 60);

    if (hoursDifference < 48) {
      return res.status(400).json({
        message:
          "Cancellations are only allowed 48 hours before the activity date",
      });
    }

    bookingToCancel.status = "Cancelled";
    await bookingToCancel.save();
    res
      .status(201)
      .json({
        bookingToCancel,
        message: "Successfully cancelled your booking!",
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const bookActivity = async (req, res) => {
  // const { touristId, activityId } = req.body;

  // if (!touristId || !activityId) {
  //   return res
  //     .status(400)
  //     .json({ message: "Tourist ID and Activity ID are required." });
  // }

  // try {
  //   // Find the activity and check if it exists
  //   const activity = await Activity.findById(activityId);
  //   if (!activity) {
  //     return res.status(404).json({ message: "Activity not found." });
  //   }

  //   // Check if booking is open for this activity
  //   if (!activity.isBookingOpen) {
  //     return res
  //       .status(400)
  //       .json({ message: "Booking is not open for this activity." });
  //   }

  //   // Create a new booking
  //   const newBooking = new BookingActivity({
  //     touristId,
  //     activityId,
  //     bookingDate: new Date(),
  //     status: "booked", // Set initial status to "booked"
  //   });

  //   await newBooking.save();

  //   return res
  //     .status(201)
  //     .json({ message: "Activity booked successfully.", booking: newBooking });
  // } catch (error) {
  //   console.error("Error booking activity:", error);
  //   return res.status(500).json({ message: "Internal server error." });
  // }
};

export const getCompletedActivities = async (req, res) => {
  const { touristId } = req.params;

  if (!touristId) {
    return res.status(400).json({ message: "Tourist ID is required." });
  }

  try {
    // Retrieve bookings for the tourist and populate activity details
    const bookings = await BookingActivity.find({
      touristId, 
      status: "Paid",
      bookingDate: { $lt: new Date() },
    }).populate(
      "activityId"
    );

    console.log("Completed Activities:", bookings);
    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching completed activities:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const addReview = async (req, res) => {
  // const { touristId, activityId, rating, comment } = req.body;

  // if (!touristId || !activityId || !rating) {
  //   return res
  //     .status(400)
  //     .json({ message: "Tourist ID, Activity ID, and rating are required." });
  // }

  // try {
  //   const booking = await BookingActivity.findOne({
  //     touristId,
  //     activityId,
  //     status: "completed",
  //   });

  //   if (!booking) {
  //     return res
  //       .status(404)
  //       .json({ message: "Booking not found or activity is not completed." });
  //   }

  //   booking.rating = rating;
  //   booking.comment = comment;
  //   await booking.save();

  //   return res
  //     .status(200)
  //     .json({
  //       message: "Review added successfully.",
  //       review: { rating, comment },
  //     });
  // } catch (error) {
  //   console.error("Error adding review:", error);
  //   return res.status(500).json({ message: "Internal server error." });
  // }
};

export const addRatingAndComment = async (req, res) => {
  // const { bookingId, rating, comment } = req.body;

  // try {
  //   // Update the booking with rating and comment
  //   const booking = await BookingActivity.findByIdAndUpdate(
  //     bookingId,
  //     { rating, comment },
  //     { new: true }
  //   ).populate("activityId");

  //   if (!booking) {
  //     return res.status(404).json({ message: "Booking not found." });
  //   }

  //   // Update average rating and review count in Activity
  //   const activity = booking.activityId;
  //   activity.reviewCount += 1;
  //   activity.averageRating =
  //     (activity.averageRating * (activity.reviewCount - 1) + rating) /
  //     activity.reviewCount;
  //   await activity.save();

  //   return res
  //     .status(200)
  //     .json({ message: "Rating and comment added successfully." });
  // } catch (error) {
  //   console.error("Error adding rating and comment:", error);
  //   return res.status(500).json({ message: "Internal server error." });
  // }
};

export const totalBookedActivitiesAdmin = async () => {
  try {
    const bookings = await BookingActivity.find({
      status: "Paid",
    }).populate("activityId");

    let totalPrice = 0;
    bookings.forEach((booking) => {
      totalPrice += booking.activityId.price || 0;
    });
    return totalPrice;
  } catch (error) {
    return -1;
  }
};

export const totalCancelledActivitiesAdmin = async () => {
  try {
    const bookings = await BookingActivity.find({
      status: "Cancelled",
    }).populate("activityId");

    let totalPrice = 0;
    bookings.forEach((booking) => {
      totalPrice += booking.activityId.price || 0;
    });
    return totalPrice;
  } catch (error) {
    return -1;
  }
};

export const totalBookedActivitiesAdvertiser = async (advertiserId) => {
  try {
    const bookings = await BookingActivity.find({
      status: "Paid",
    }).populate("activityId");

    let totalPrice = 0;

    bookings.forEach((booking) => {
      if (booking.advertiserId === advertiserId) {
        totalPrice += booking.activityId.price || 0;
      }
    });
    return totalPrice;
  } catch (error) {
    return -1;
  }
};

export const totalCancelledActivitiesAdvertiser = async (advertiserId) => {
  try {
    const bookings = await BookingActivity.find({
      status: "Cancelled",
    }).populate("activityId");

    let totalPrice = 0;
    bookings.forEach((booking) => {
      if (booking.advertiserId === advertiserId)
        totalPrice += booking.activityId.price || 0;
    });
    return totalPrice;
  } catch (error) {
    return -1;
  }
};
export const getActivitiesReport = async (req, res) => {
  //const advertiserId = req.user.userId; // Extract advertiser ID from the authenticated user
  const advertiserId =  req.body.id; 
  const {year, month, day} = req.query;


  try {
    const matchConditions = {
      status: { $in: ['booked', 'completed'] }, // Filter by status
    };
    
    if (req.user?.role === 'Advertiser' && advertiserId) {
      matchConditions['activityDetails.advertiserId'] = new mongoose.Types.ObjectId(advertiserId);

    }

    // Add date-based filtering if year, month, or day is provided
    if (year || month || day) {
      matchConditions.$expr = {
        $and: [
          ...(year ? [{ $eq: [{ $year: '$bookingDate' }, parseInt(year)] }] : []),
          ...(month ? [{ $eq: [{ $month: '$bookingDate' }, parseInt(month)] }] : []),
          ...(day ? [{ $eq: [{ $dayOfMonth: '$bookingDate' }, parseInt(day)] }] : []),
        ],
      };
    }
  
    const results = await BookingActivity.aggregate([
      {
        $lookup: {
          from: 'activities', // Activity collection name
          localField: 'activityId', // Field in BookingActivity
          foreignField: '_id', // Match with Activity `_id`
          as: 'activityDetails',
        },
      },
      {
        $unwind: '$activityDetails', // Flatten the activity details array
      },
      {
        $match: matchConditions,
      },
      {
        $group: {
          _id: '$activityId', // Group by the activity ID
          activityTitle: { $first: '$activityDetails.title' },
          bookingCount: { $sum: 1 }, // Count the number of bookings per activity
          revenue: { $sum: '$activityDetails.price' }, // Sum up the price of bookings per activity
          
        },
      },
      {
        $project: {
          _id: 1, // Include activity ID
          name: '$activityTitle', // Include activity title
          bookingCount: 1, // Include the count of bookings
          revenue: 1, // Include the total revenue
        },
      },
    ]);

    // Send the aggregated results as a response
    if(results.length == 0)
      return res.status(200).json({message: "No data to show"});
    return res.status(200).json({
      data: results,
      message: "Successfully fetched the activities report"

    });
  } catch (error) {
    console.error('Error fetching activities report:', error);

    res.status(500).json({ message: 'Failed to fetch activity report', error: error.message });
  }
};