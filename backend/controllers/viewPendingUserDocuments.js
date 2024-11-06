import PendingUser from "../models/pendingUserModel.js";
import PdfDetailsTourGuide from "../models/pdfDetailsTourGuideModel.js";
import PdfDetailsSellerAdvertiser from "../models/pdfsDetailsSeller&AdvModel.js";

export const viewPendingUserDocuments = async (req, res) => {
  try {
    // Retrieve all pending users
    const pendingUsers = await PendingUser.find({});

    // Prepare an array to store each user's info along with their documents
    const userDocuments = await Promise.all(
      pendingUsers.map(async (user) => {
        let documents = null;

        // Fetch documents based on the user's type
        if (user.type === "TourGuide") {
          documents = await PdfDetailsTourGuide.findOne({
            username: user.username,
          });
        } else if (user.type === "Seller" || user.type === "Advertiser") {
          documents = await PdfDetailsSellerAdvertiser.findOne({
            username: user.username,
          });
        }

        // Return both user info and documents (or empty object if no documents found)
        return {
          user,
          documents: documents || {}, // Include an empty object if no documents are found
        };
      })
    );

    // Send response with all users and their documents (if any)
    res.status(200).json(userDocuments);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error retrieving documents for pending users" });
  }
};
