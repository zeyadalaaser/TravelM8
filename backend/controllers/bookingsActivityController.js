import BookingActivity from "../models/bookingsActivityModel.js";
import Activity from "../models/activityModel.js";

// Booking an activity
export const bookActivity = async (req, res) => {
    const { touristId, activityId } = req.body;

    if (!touristId || !activityId) {
        return res.status(400).json({ message: "Tourist ID and Activity ID are required." });
    }

    try {
        // Find the activity and check if it exists
        const activity = await Activity.findById(activityId);
        if (!activity) {
            return res.status(404).json({ message: "Activity not found." });
        }

        // Check if booking is open for this activity
        if (!activity.isBookingOpen) {
            return res.status(400).json({ message: "Booking is not open for this activity." });
        }

        // Create a new booking
        const newBooking = new BookingActivity({
            touristId,
            activityId,
            bookingDate: new Date(),
            status: "booked" // Set initial status to "booked"
        });

        await newBooking.save();

        return res.status(201).json({ message: "Activity booked successfully.", booking: newBooking });
    } catch (error) {
        console.error("Error booking activity:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

export const getCompletedActivities = async (req, res) => {
    const { touristId } = req.params;

    if (!touristId) {
        return res.status(400).json({ message: "Tourist ID is required." });
    }

    try {
        // Retrieve bookings for the tourist and populate activity details
        const bookings = await BookingActivity.find({ touristId }).populate("activityId");

        const completedActivities = [];
        for (const booking of bookings) {
            const activityDate = booking.activityId?.date;

            // Check if the activity date is in the past and status is "booked"
            if (activityDate && new Date(activityDate) < new Date() && booking.status === "booked") {
                booking.status = "completed"; // Update status to "completed"
                await booking.save(); // Save the updated booking
            }

            // Only add bookings with status "completed" to the response
            if (booking.status === "completed") {
                completedActivities.push(booking);
            }
        }

        console.log("Completed Activities:", completedActivities);
        return res.status(200).json(completedActivities);
    } catch (error) {
        console.error("Error fetching completed activities:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};


export const addReview = async (req, res) => {
    const { touristId, activityId, rating, comment } = req.body;

    if (!touristId || !activityId || !rating) {
        return res.status(400).json({ message: "Tourist ID, Activity ID, and rating are required." });
    }

    try {
        const booking = await BookingActivity.findOne({ touristId, activityId, status: 'completed' });

        if (!booking) {
            return res.status(404).json({ message: "Booking not found or activity is not completed." });
        }

        booking.rating = rating;
        booking.comment = comment;
        await booking.save();

        return res.status(200).json({ message: "Review added successfully.", review: { rating, comment } });
    } catch (error) {
        console.error("Error adding review:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};
