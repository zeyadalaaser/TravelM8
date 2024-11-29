import mongoose from "mongoose";
import Booking from "../models/bookingsModel.js";
import Rating from "../models/ratingModel.js";
import Itinerary from "../models/itineraryModel.js";
import { updateItineraryUponBookingModification } from "./itineraryController.js";
import { updatePoints } from "./touristController.js";
import { getItineraryPrice } from "./itineraryController.js";

export const createBooking2 = async (req, res) => {
  let msg;
  try {
    const { itinerary, tourGuide, tourDate, price, paymentMethod } = req.body;
    const tourist = req.user.userId;
    const newBooking = new Booking({
      tourist,
      itinerary,
      tourGuide,
      tourDate,
      price,
      paymentMethod,
    });
    const savedBooking = await newBooking.save();
    const result = await updateItineraryUponBookingModification(
      itinerary,
      tourDate,
      "book"
    );
    msg = result.message;
    console.log(result.success);
    console.log(result);
    const itineraryPrice = await getItineraryPrice(itinerary);
    if (result.success && itineraryPrice) {
      console.log(itineraryPrice);
      const { points, current } = await updatePoints(tourist, itineraryPrice);
      res.status(201).json({
        savedBooking,
        message: `Successful Booking of Itinerary! You gained ${points} points and currently have ${current} loyality points`,
      });
    } else
      res.status(203).json({
        message: msg,
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllTourBookings = async (req, res) => {
  try {
    const tourist = req.user.userId;
    const allBookings = await Booking.find({ tourist: tourist }).populate(
      "itinerary"
    ); // Populating the itinerary field

    res
      .status(200)
      .json({ allBookings, message: "Successful Retrieval of Itineraries!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    // const touristId = req.user.userId;
    const bookingId = req.params.id;

    const bookingToCancel = await Booking.findById(bookingId);

    const currentDate = new Date();
    const slotDateObj = new Date(bookingToCancel.tourDate);

    const hoursDifference = (slotDateObj - currentDate) / (1000 * 60 * 60);

    if (hoursDifference < 48) {
      return res.status(400).json({
        message:
          "Cancellations are only allowed 48 hours before the activity date",
      });
    }

    bookingToCancel.completionStatus = "Cancelled";
    await bookingToCancel.save();
    const result = await updateItineraryUponBookingModification(
      bookingToCancel.itinerary,
      bookingToCancel.tourDate,
      "cancel"
    );

    res.status(200).json({
      bookingToCancel,
      success: result.success,
      message: result.success
        ? "Successfully cancelled your booking!"
        : result.message,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCompletedToursByTourist = async (req, res) => {
  try {
    const { touristId } = req.params;

    const completedTours = await Booking.find({
      tourist: touristId,
      tourDate: { $lt: new Date() },
      completionStatus: "Paid",
    })
      .populate("itinerary", "name description")
      .populate("tourGuide", "name username");

    res.status(200).json(completedTours);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving completed tours", error });
  }
};
// Rate a tour guide after completing a tour
export const rateTourGuide = async (req, res) => {
  try {
    const { booking, rating, comment } = req.body;
    const { tourist } = req.params;

    // Find the booking and ensure it's completed and the tourist hasn't already rated it
    const bookingMade = await Booking.findOne({
      _id: booking,
      tourist: tourist,
      completionStatus: "Paid",
      tourDate: { $lt: new Date() },
      ratingGiven: false,
    });

    if (!bookingMade) {
      return res.status(400).json({
        message: "You can only rate completed tours that have not been rated.",
      });
    }

    // Create the rating
    const newRating = new Rating({
      userId: tourist,
      entityId: booking.tourGuide,
      entityType: "TourGuide",
      rating,
      comment,
    });

    await newRating.save();

    // Update booking to reflect that the tourist has rated the tour guide
    bookingMade.ratingGiven = true;
    await bookingMade.save();

    res
      .status(201)
      .json({ message: "Tour guide rated successfully", newRating });
  } catch (error) {
    res.status(500).json({ message: "Error rating tour guide", error });
  }
};

export const totalBookedItinerariesAdmin = async () => {
  try {
    const bookings = await Booking.find({
      completionStatus: "Paid",
    }).populate("itinerary");

    let totalPrice = 0;
    bookings.forEach((booking) => {
      totalPrice += booking.itinerary.price || 0;
    });
    return totalPrice;
  } catch (error) {
    return -1;
  }
};

export const totalCancelledItinerariesAdmin = async () => {
  try {
    const bookings = await Booking.find({
      completionStatus: "Cancelled",
    }).populate("itinerary");

    let totalPrice = 0;
    bookings.forEach((booking) => {
      totalPrice += booking.itinerary.price || 0;
    });
    return totalPrice;
  } catch (error) {
    return -1;
  }
};

export const totalBookedItineraiesTourguide = async (tourGuideId) => {
  try {
    const bookings = await Booking.find({
      completionStatus: "Paid",
    }).populate("itinerary");

    let totalPrice = 0;
    bookings.forEach((booking) => {
      if (booking.tourGuide === tourGuideId) {
        totalPrice += booking.itinerary.price || 0;
      }
    });
    return totalPrice;
  } catch (error) {
    return -1;
  }
};

export const totalCancelledItineraiesTourguide = async (tourGuideId) => {
  try {
    const bookings = await Booking.find({
      completionStatus: "Cancelled",
    }).populate("itinerary");

    let totalPrice = 0;
    bookings.forEach((booking) => {
      if (booking.tourGuide === tourGuideId) {
        totalPrice += booking.itinerary.price || 0;
      }
    });
    return totalPrice;
  } catch (error) {
    return -1;
  }
};

export const getItinerariesReport = async (req, res) => {
  //const tourguideId = req.user.userId;
  const tourguideId = req.body.id;
  const { year, month, day } = req.query;

  try {
    const matchConditions = {
      completionStatus: { $in: ["Pending", "Completed"] }, // Match specific statuses
    };

    if (req.user?.role === "TourGuide" && tourguideId) {
      matchConditions["tourGuide"] = new mongoose.Types.ObjectId(tourguideId);
    }

    // Add date-based filtering if year, month, or day is provided
    if (year || month || day) {
      matchConditions.$expr = {
        $and: [
          ...(year
            ? [{ $eq: [{ $year: "$bookingDate" }, parseInt(year)] }]
            : []),
          ...(month
            ? [{ $eq: [{ $month: "$bookingDate" }, parseInt(month)] }]
            : []),
          ...(day
            ? [{ $eq: [{ $dayOfMonth: "$bookingDate" }, parseInt(day)] }]
            : []),
        ],
      };
    }

    const results = await Booking.aggregate([
      {
        $match: matchConditions,
      },
      {
        $lookup: {
          from: "itineraries", // Itinerary collection name
          localField: "itinerary", // Grouped itinerary ID
          foreignField: "_id", // Match with Itinerary `_id`
          as: "itineraryDetails",
        },
      },
      {
        $unwind: "$itineraryDetails", // Flatten the itinerary details array
      },
      {
        $group: {
          _id: "$itinerary", // Group by the itinerary ID
          bookingCount: { $sum: 1 }, // Count the number of bookings per itinerary
          revenue: { $sum: "$itineraryDetails.price" }, // Sum up the price of bookings per itinerary
          itineraryTitle: { $first: "$itineraryDetails.name" },
        },
      },
      {
        $project: {
          _id: 1, // Include itinerary ID
          name: "$itineraryTitle", // Include itinerary name
          bookingCount: 1, // Include the count of bookings
          revenue: 1, // Include the total revenue
        },
      },
    ]);

    console.log(results);
    if (results.length == 0)
      return res.status(200).json({ message: "No data to show" });
    return res.status(200).json({
      data: results,
      message: "Successfully fetched the itineraries report",
    });
  } catch (error) {
    console.error("Error fetching itineraries report:", error);

    res.status(500).json({
      message: "Failed to fetch itinerary report",
      error: error.message,
    });
  }
};
