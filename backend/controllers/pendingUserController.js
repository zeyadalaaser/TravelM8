import PendingUser from "../models/pendingUserModel.js";
import Advertiser from "../models/advertiserModel.js";
import Seller from "../models/sellerModel.js";
import TourGuide from "../models/tourguideModel.js";
import { checkUniqueUsernameEmail } from "../helpers/signupHelper.js";
import PdfDetailsTourGuide from "../models/pdfDetailsTourGuideModel.js";
import PdfDetailsSellerAdvertiser from "../models/pdfsDetailsSeller&AdvModel.js";


export const createPendingUser = async (req, res) => {
  const { username, email, password, type } = req.body;

  // Log incoming data to verify the request body
  console.log('Received data:', { username, email, password, type });

  const isNotUnique = await checkUniqueUsernameEmail(username, email);

  // Log if the username/email is unique or not
  console.log('Is username or email unique?', !isNotUnique);

  if (isNotUnique) {
    // Log the failure reason
    console.log('Username or email is already in use.');
    return res
      .status(400)
      .json({ message: "Username or email is already in use." });
  }

  try {
    // Log before attempting to create a new pending user
    console.log('Attempting to create a new pending user...');

    const pending = await PendingUser.create({
      username,
      email,
      password,
      type,
    });

    // Log the successfully created user
    console.log('Pending user created successfully:', pending);

    res.status(200).json(pending);
  } catch (error) {
    // Log the error if there is an issue with creation
    console.error('Error creating pending user:', error.message);
    res.status(400).json({ error: error.message });
  }
};


// Controller to accept a pending user
export const acceptPendingUser = async (req, res) => {
  const userId = req.params.id;

  try {
    // Find the pending user by ID
    const pending = await PendingUser.findById(userId);

    // Check if the pending user exists
    if (!pending) {
      return res.status(404).json({ message: "Pending user not found" });
    }

    const type = pending.type;

    // Prepare the new user data to be added
    const newUser = {
      username: pending.username,
      email: pending.email,
      password: pending.password,
    };

    let result;

    // Create the user in the appropriate collection based on the user type
    switch (type) {
      case "TourGuide":
        result = await TourGuide.create(newUser);
        break;
      case "Seller":
        result = await Seller.create(newUser);
        break;
      case "Advertiser":
        result = await Advertiser.create(newUser);
        break;
      default:
        return res.status(400).json({ message: "Invalid user type" });
    }

    // If user creation was successful, remove the user from the PendingUser collection
    if (result) {
      await PendingUser.findByIdAndDelete(userId);
      return res.status(200).json({
        message: "User accepted and added to the main collection",
        user: result,
      });
    } else {
      return res.status(500).json({ message: "Failed to create new user" });
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Controller to reject a pending user
export const rejectPendingUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find and delete the user from the pendingUsers collection
    const deletedUser = await PendingUser.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "Pending user not found" });
    }

    return res.json({
      message: "User rejected and removed from pending users",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to reject a pending user
export const getPendingUsers = async (req, res) => {
  //retrieve all users from the database
  try {
    const pendingUsers = await PendingUser.find({});
    res.status(200).json(pendingUsers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const rejectPendingUser2 = async (req, res) => {
  const userId = req.params.id;

  try {
    // Find the pending user by ID
    const pendingUser = await PendingUser.findById(userId);

    if (!pendingUser) {
      console.log("User not found");
      return res.status(404).json({ message: "Pending user not found" });
    }

    // Delete the user's documents from the appropriate PDF schema based on their type
    if (pendingUser.type === "TourGuide") {
      await PdfDetailsTourGuide.findOneAndDelete({
        username: pendingUser.username,
      });
    } else if (
      pendingUser.type === "Seller" ||
      pendingUser.type === "Advertiser"
    ) {
      await PdfDetailsSellerAdvertiser.findOneAndDelete({
        username: pendingUser.username,
      });
    }

    // Delete the user from the PendingUser collection
    await PendingUser.findByIdAndDelete(userId);

    res.status(200).json({
      message: "User rejected and removed from pending users and documents",
    });
  } catch (error) {
    console.error("Error rejecting user and deleting documents:", error);
    res
      .status(500)
      .json({ error: "Error rejecting user and deleting documents" });
  }
};
export const approvePendingUser = async (req, res) => {
  const userId = req.params.id;

  try {
    // Find the pending user by ID
    const pendingUser = await PendingUser.findById(userId);
    if (!pendingUser) {
      return res.status(404).json({ message: "Pending user not found" });
    }

    // Prepare new user data
    const { username, email, password, type } = pendingUser;

    let newUser;
    // Move user to respective collection
    switch (type) {
      case "TourGuide":
        newUser = await TourGuide.create({
          username,
          email,
          password,
        });
        break;
      case "Seller":
        newUser = await Seller.create({
          username,
          email,
          password,
        });
        break;
      case "Advertiser":
        newUser = await Advertiser.create({
          username,
          email,
          password,
        });
        break;
      default:
        return res.status(400).json({ message: "Invalid user type" });
    }

    // Delete user from PendingUser collection if added successfully
    if (newUser) {
      await PendingUser.findByIdAndDelete(userId);
      return res
        .status(200)
        .json({ message: `${type} approved successfully`, user: newUser });
    } else {
      throw new Error("Failed to approve user");
    }
  } catch (error) {
    console.error("Error approving user:", error);
    res.status(500).json({ message: "Error approving user" });
  }
};
