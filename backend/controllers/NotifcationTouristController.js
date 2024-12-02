import Booking from "../models/bookingsModel.js";

export const getBookingNotifications = async (req, res) => {
  try {
    const tourist = req.user.userId;
    console.log('Tourist ID:', tourist); // Debug log

    // First, let's check if there are any bookings at all
    const allBookings = await Booking.find();
    console.log('All bookings in system:', allBookings.length); // Debug log

    // Now let's check bookings for this specific tourist
    const bookings = await Booking.find({ tourist })
      .populate({
        path: "itinerary",
        select: "name"
      })
      .populate({
        path: "tourGuide",
        select: "name"
      })
      .sort({ createdAt: -1 });

    console.log('Found bookings for tourist:', bookings); // Debug log

    if (!bookings || bookings.length === 0) {
      return res.status(200).json({
        notifications: [],
        message: "No bookings found for this tourist"
      });
    }

    // Transform bookings into notification format
    const notifications = bookings.map(booking => ({
      id: booking._id,
      type: 'booking',
      title: `Booking ${booking.completionStatus}`,
      message: `Your booking for ${booking.itinerary?.name || 'Unknown Itinerary'} with ${booking.tourGuide?.name || 'Unknown Guide'} on ${new Date(booking.tourDate).toLocaleDateString()}`,
      status: booking.completionStatus,
      price: booking.price,
      paymentMethod: booking.paymentMethod,
      createdAt: booking.createdAt,
      read: false
    }));

    console.log('Transformed notifications:', notifications); // Debug log

    res.status(200).json({
      notifications,
      message: "Successfully retrieved notifications!"
    });
  } catch (error) {
    console.error('Error in getBookingNotifications:', error);
    res.status(400).json({ 
      message: error.message,
      error: error.stack // Include stack trace for debugging
    });
  }
};