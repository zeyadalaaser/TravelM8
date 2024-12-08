import mongoose from "mongoose";
import Booking from "../models/bookingsModel.js";
import Rating from "../models/ratingModel.js";
import Itinerary from "../models/itineraryModel.js";
import { updateItineraryUponBookingModification } from "./itineraryController.js";
import { updatePoints } from "./touristController.js";
import { getItineraryPrice } from "./itineraryController.js";
import tourist1 from "../models/touristModel.js"; // Import tourist model
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mennayehiahassan@gmail.com", // Replace with your email
    pass: "dsbkyetgxkynwbpz", // Replace with app password
  },
});
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
      const touristData = await tourist1.findById(tourist);
      if (!touristData) {
        return res.status(404).json({ message: "Tourist not found." });
      }
      if (paymentMethod === "Wallet") {
        touristData.wallet -= itineraryPrice;
        await touristData.save();
      }
      const emailSubject = "Booking Confirmation";
      const emailBody = `
        <h1>Thank you for booking with us!</h1>
        <p>Dear ${touristData.name},</p>
        <p>Your booking for the itinerary <strong>${savedBooking.itinerary}</strong> has been confirmed.</p>
        <p><strong>Details:</strong></p>
        <ul>
          <li>Booking ID: ${savedBooking._id}</li>
          <li>Tour Date: ${tourDate}</li>
          <li>Price: ${price}</li>
          <li>Payment Method: ${paymentMethod}</li>
        </ul>
        <p>You have earned <strong>${points}</strong> loyalty points and now have a total of <strong>${current}</strong> points.</p>
        <p>We hope you enjoy the tour!</p>
        <p>Best regards,</p>
        <p>The Team</p>
      `;

      await transporter.sendMail({
        from: "mennayehiahassan@gmail.com", // Sender address
        to: touristData.email, // Tourist's email
        subject: emailSubject,
        html: emailBody, // Email content
      });

      res.status(201).json({
        savedBooking,
        message: `You gained ${points} points and currently have ${current} loyality points.`,
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
      const userId = req.user?.userId;
      const bookingId = req.params.id;

      const bookingToCancel = await Booking.findById(bookingId).populate('tourist'); // Assuming 'tourist' is the reference to the user

      if (!bookingToCancel) {
          return res.status(404).json({ message: "Booking not found" });
      }

      const currentDate = new Date();
      const slotDateObj = new Date(bookingToCancel.tourDate);
      const hoursDifference = (slotDateObj - currentDate) / (1000 * 60 * 60);

      if (hoursDifference < 48) {
          return res.status(400).json({
              message: "Cancellations are only allowed 48 hours before the activity date",
          });
      }

      // Update booking status
      bookingToCancel.completionStatus = "Cancelled";
      await bookingToCancel.save();

      // Refund logic
      const tourist = bookingToCancel.tourist; // Assuming the booking has a reference to the tourist
      const refundAmount = bookingToCancel.price; // Assuming 'price' is the amount paid for the booking

      // Update user's wallet balance
      tourist.wallet += refundAmount; // Add the refund amount to the wallet
      await tourist.save(); // Save the updated wallet balance

      res.status(200).json({
          success: true,
          message: "Successfully cancelled your booking!",
          amountRefunded: refundAmount,
          newBalance: tourist.wallet,
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

export const getItinerariesReport = async (req, res) => {
  const tourguideId = req.user.userId;
  const { year, month, day } = req.query;

  try {
    const matchConditions = {
      completionStatus: { $in: ['Pending', 'Completed','Paid'] },  
    };
    if(req.user.role === "TourGuide" && tourguideId){
      matchConditions["tourGuide"] =  new mongoose.Types.ObjectId(tourguideId);
    }
   console.log("tourguide in match conditions: " ,matchConditions["tourguide"]);
    
    if (year || month || day) {
      matchConditions.$expr = {
        $and: [
          ...(year ? [{ $eq: [{ $year: { $toDate: '$bookingDate' } }, parseInt(year)] }] : []),
          ...(month ? [{ $eq: [{ $month: { $toDate: '$bookingDate' } }, parseInt(month)] }] : []),
          ...(day ? [{ $eq: [{ $dayOfMonth: { $toDate: '$bookingDate' } }, parseInt(day)] }] : []),
        ],
      };
    }

    const results = await Booking.aggregate([
      {
        $match: matchConditions,
      },
      {
        $lookup: {
          from: 'itineraries', // Itinerary collection name
          localField: 'itinerary', // Grouped itinerary ID
          foreignField: '_id', // Match with Itinerary `_id`
          as: 'itineraryDetails',
        },
      },
      {
        $unwind: '$itineraryDetails',  
      },
      {
        $group: {
          _id: '$itinerary', // Group by the itinerary ID
          bookingCount: { $sum: 1 }, // Count the number of bookings per itinerary
          revenue: { $sum: '$itineraryDetails.price' }, // Sum up the price of bookings per itinerary
          itineraryTitle: { $first: '$itineraryDetails.name' },
        },
      },
      {
        $project: {
          _id: 1, // Include itinerary ID
          name: '$itineraryTitle', // Include itinerary name
          bookingCount: 1, // Include the count of bookings
          revenue: 1, // Include the total revenue
        },
      },
    ]);

    console.log(results);

    if (results.length == 0) {
      return res.status(200).json({ message: "No data to show" });
    }

    return res.status(200).json({
      data: results,
      message: 'Successfully fetched the itineraries report',
    });
  } catch (error) {
    console.error('Error fetching itineraries report:', error);
    res.status(500).json({
      message: 'Failed to fetch itinerary report',
      error: error.message,
    });
  }
};
