import Booking from '../models/bookingsModel.js';
import Rating from '../models/ratingModel.js';
import { updateItineraryUponBookingModification } from "./itineraryController.js";
import {updatePoints} from "./touristController.js"
import { getItineraryPrice } from './itineraryController.js';

export const createBooking2 = async (req, res) => {
  try {
    const { itinerary, tourGuide, tourDate } = req.body;
    const tourist = req.user.userId;
    const newBooking = new Booking({
      tourist,
      itinerary,
      tourGuide,
      tourDate
    });
    const savedBooking = await newBooking.save();
    const result = await updateItineraryUponBookingModification(itinerary, tourDate, "book");
    console.log(result.success);
    console.log(result);
    const itineraryPrice = await getItineraryPrice(itinerary);
    if (result.success && itineraryPrice){
      console.log(itineraryPrice);
      const {points, current} = await updatePoints(tourist,itineraryPrice);
      res.status(201).json({ savedBooking, message: `Successful Booking of Itinerary! You gained ${points} points and currently have ${current} loyality points` });
    }else
      res.status(203).json({ message: "Max Number of bookings reached! Failed to book itinerary!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const getAllTourBookings = async (req, res) => {
  try {
    const tourist = req.user.userId;
    const allBookings = await Booking.find({ tourist: tourist })
      .populate('itinerary'); // Populating the itinerary field

    
    res.status(200).json({ allBookings, message: "Successful Retrieval of Itineraries!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

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
        message: "Cancellations are only allowed 48 hours before the activity date",
      });
    }

    bookingToCancel.completionStatus = 'Cancelled';
    await bookingToCancel.save();
    const result = await updateItineraryUponBookingModification(bookingToCancel.itinerary, bookingToCancel.tourDate, "cancel");

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
}


export const createBooking = async (req, res) => {
  try {
    const { tourist, itinerary, tourGuide, tourDate } = req.body;

    const newBooking = new Booking({
      tourist,
      itinerary,
      tourGuide,
      tourDate,
    });

    await newBooking.save();
    res.status(201).json({ message: 'Booking created successfully', newBooking });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error });
  }
};


export const getCompletedToursByTourist = async (req, res) => {
  try {
    const { touristId } = req.params;

    await Booking.updateMany(
      {
        tourist: touristId,
        tourDate: { $lt: new Date() },
        completionStatus: 'Pending',
      },
      { $set: { completionStatus: 'Completed' } }
    );

    const completedTours = await Booking.find({
      tourist: touristId,
      completionStatus: 'Completed',
    })
      .populate('itinerary', 'name description')
      .populate('tourGuide', 'name username');

    res.status(200).json(completedTours);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving completed tours', error });
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
      completionStatus: 'Completed',
      ratingGiven: false,
    });

    if (!bookingMade) {
      return res.status(400).json({ message: 'You can only rate completed tours that have not been rated.' });
    }

    // Create the rating
    const newRating = new Rating({
      userId: tourist,
      entityId: booking.tourGuide,
      entityType: 'TourGuide',
      rating,
      comment,
    });

    await newRating.save();

    // Update booking to reflect that the tourist has rated the tour guide
    bookingMade.ratingGiven = true;
    await bookingMade.save();

    res.status(201).json({ message: 'Tour guide rated successfully', newRating });
  } catch (error) {
    res.status(500).json({ message: 'Error rating tour guide', error });
  }
};


