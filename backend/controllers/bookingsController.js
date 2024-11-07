import Booking from '../models/bookingsModel.js';
import Rating from '../models/ratingModel.js';
import Tourist from '../models/touristModel.js';
import Itinerary from '../models/itineraryModel.js';
import TourGuide from '../models/tourguideModel.js';

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


