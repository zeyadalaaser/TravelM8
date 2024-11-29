import cron from "node-cron";
import Booking from "../../models/bookingsModel.js";
import Activity from "../../models/activityModel.js";
import BookingActivity from "../../models/bookingsActivityModel.js";
import {
  sendEmailReminder,
  sendEmailReminder2,
} from "../../controllers/notificationController.js";

// Schedule a job to run every hour
// cron.schedule("*/5 * * * *", async () => {
//   try {
//     console.log("Running scheduled job to send email reminders...");

//     // Get current date and time
//     const currentDate = new Date();

//     // Get 48 hours from now
//     const twoDaysLater = new Date();
//     twoDaysLater.setHours(twoDaysLater.getHours() + 48);

//     // Maintain a map to track emails already sent within this execution
//     const sentEmailsMap = new Map();

//     // Find pending bookings within the next 48 hours
//     const upcomingBookings = await Booking.find({
//       tourDate: { $gte: currentDate, $lte: twoDaysLater },
//       completionStatus: "Paid",
//     })
//       .populate("tourist") // Populate tourist details
//       .populate("itinerary"); // Populate itinerary details

//     if (upcomingBookings.length === 0) {
//       console.log("No pending bookings found within the next 48 hours.");
//     }

//     // Loop through each booking and send an email reminder
//     for (const booking of upcomingBookings) {
//       const { tourist, itinerary, tourDate } = booking;
//       const { email, username } = tourist; // Assuming Tourist model has email/username fields
//       const { name: itineraryName } = itinerary; // Assuming Itinerary has a 'name'

//       // Create a unique key for deduplication
//       const emailKey = `${email}-${itineraryName}`;

//       // Check if an email has already been sent for this itinerary and tourist
//       if (sentEmailsMap.has(emailKey)) {
//         console.log(
//           `Skipping duplicate email for ${email} and itinerary: ${itineraryName}`
//         );
//         continue;
//       }

//       // Use the email reminder function
//       const result = await sendEmailReminder(
//         email,
//         username,
//         itineraryName,
//         tourDate
//       );

//       if (result.success) {
//         console.log(`Reminder sent to ${email} for booking: ${booking._id}`);
//         // Mark this email as sent for this itinerary
//         sentEmailsMap.set(emailKey, true);
//       } else {
//         console.error(`Failed to send reminder to ${email}: ${result.error}`);
//       }
//     }
//   } catch (error) {
//     console.error("Error during scheduled job:", error);
//   }
// });

cron.schedule("*/3 * * * *", async () => {
  try {
    console.log(
      "Running scheduled job to send email reminders for upcoming activities..."
    );

    // Get current date and time
    const currentDate = new Date();

    // Get 48 hours from now
    const twoDaysLater = new Date();
    twoDaysLater.setHours(twoDaysLater.getHours() + 48);

    // Maintain a map to track emails already sent within this execution
    const sentEmailsMap = new Map();

    // Find bookings for activities within the next 48 hours based on activity date
    const upcomingBookings = await BookingActivity.find({
      completionStatus: "Paid", // Ensure the booking is completed
    })
      .populate("touristId") // Populate tourist details
      .populate("activityId") // Populate activity details
      .exec();

    if (upcomingBookings.length === 0) {
      console.log("No upcoming bookings found within the next 48 hours.");
    }

    // Loop through each booking and check if activity date is within the next 48 hours
    for (const booking of upcomingBookings) {
      const { touristId, activityId, bookingDate } = booking;
      if (!activityId) {
        console.error(`No activityId for booking: ${booking._id}`);
        continue; // Skip this booking if there's no activity
      }
      // Destructure only if activityId is valid
      const { email, username } = touristId; // Assuming Tourist model has email/username fields
      const { title, date, location, price } = activityId || {}; // Assuming Activity model has title, date, location, price
      if (!title) {
        console.error(`Activity title is missing for booking: ${booking._id}`);
        continue; // Skip this booking if title is missing
      }

      // Check if the activity date is within the next 48 hours
      if (date < currentDate || date > twoDaysLater) {
        continue; // Skip this booking if the activity date is not within the 48-hour window
      }

      // Create a unique key for deduplication
      const emailKey = `${email}-${title}`;

      // Check if an email has already been sent for this tourist and activity
      if (sentEmailsMap.has(emailKey)) {
        console.log(
          `Skipping duplicate email for ${email} and activity: ${title}`
        );
        continue;
      }

      // Create email subject and body
      const emailSubject = `Reminder: Upcoming Activity - ${title}`;
      const emailBody = `
        <h1>Reminder: Your Upcoming Activity - ${title}</h1>
        <p>Dear ${username},</p>
        <p>This is a reminder about your upcoming activity:</p>
        <ul>
          <li><strong>Activity:</strong> ${title}</li>
          <li><strong>Location:</strong> ${location.name} (Lat: ${location.lat}, Lng: ${location.lng})</li>
          <li><strong>Activity Date:</strong> ${date}</li>
          <li><strong>Price:</strong> ${price}</li>
        </ul>
        <p>Your booking was made on: ${bookingDate}</p>
        <p>We look forward to seeing you at the activity!</p>
        <p>Best regards,</p>
        <p>Team</p>
      `;

      // Use the email reminder function
      const result = await sendEmailReminder2(email, emailSubject, emailBody);

      if (result.success) {
        console.log(`Reminder sent to ${email} for activity: ${title}`);
        // Mark this email as sent for this activity
        sentEmailsMap.set(emailKey, true);
      } else {
        console.error(`Failed to send reminder to ${email}: ${result.error}`);
      }
    }
  } catch (error) {
    console.error("Error during scheduled job:", error);
  }
});
