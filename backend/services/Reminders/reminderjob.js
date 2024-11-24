import cron from "node-cron";
import Booking from "../../models/bookingsModel.js";
import { sendEmailReminder } from "../../controllers/notificationController.js";

// Schedule a job to run every hour
cron.schedule("0 * * * *", async () => {
  try {
    console.log("Running scheduled job to send email reminders...");

    // Get current date and time
    const currentDate = new Date();

    // Get 48 hours from now
    const twoDaysLater = new Date();
    twoDaysLater.setHours(twoDaysLater.getHours() + 48);

    // Maintain a map to track emails already sent within this execution
    const sentEmailsMap = new Map();

    // Find pending bookings within the next 48 hours
    const upcomingBookings = await Booking.find({
      tourDate: { $gte: currentDate, $lte: twoDaysLater },
      completionStatus: "Pending",
    })
      .populate("tourist") // Populate tourist details
      .populate("itinerary"); // Populate itinerary details

    if (upcomingBookings.length === 0) {
      console.log("No pending bookings found within the next 48 hours.");
    }

    // Loop through each booking and send an email reminder
    for (const booking of upcomingBookings) {
      const { tourist, itinerary, tourDate } = booking;
      const { email, username } = tourist; // Assuming Tourist model has email/username fields
      const { name: itineraryName } = itinerary; // Assuming Itinerary has a 'name'

      // Create a unique key for deduplication
      const emailKey = `${email}-${itineraryName}`;

      // Check if an email has already been sent for this itinerary and tourist
      if (sentEmailsMap.has(emailKey)) {
        console.log(
          `Skipping duplicate email for ${email} and itinerary: ${itineraryName}`
        );
        continue;
      }

      // Use the email reminder function
      const result = await sendEmailReminder(
        email,
        username,
        itineraryName,
        tourDate
      );

      if (result.success) {
        console.log(`Reminder sent to ${email} for booking: ${booking._id}`);
        // Mark this email as sent for this itinerary
        sentEmailsMap.set(emailKey, true);
      } else {
        console.error(`Failed to send reminder to ${email}: ${result.error}`);
      }
    }
  } catch (error) {
    console.error("Error during scheduled job:", error);
  }
});
