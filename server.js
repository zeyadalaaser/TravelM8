const express = require("express");
const cors = require("cors");
const connectDB = require("./backend/config/db");
const userController = require("./backend/controllers/userController");
const touristController = require("./backend/controllers/touristController");
const activityCategoryController = require("./backend/controllers/activityCategoryController");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("frontend/public")); // Serve static files from the public directory inside frontend

// Connect to MongoDB
connectDB();

// Serve HTML pages from the public folder
app.get("/user", (req, res) => {
  res.sendFile(__dirname + "/frontend/public/user.html"); // Landing page
});

app.get("/admin", (req, res) => {
  res.sendFile(__dirname + "/frontend/public/index.html"); // Admin registration page
});

app.get("/tourist", (req, res) => {
  res.sendFile(__dirname + "/frontend/public/index2.html"); // Tourist registration page
});

// New Route for Activity Categories
app.get("/activityCategory", (req, res) => {
  res.sendFile(__dirname + "/frontend/public/activities.html"); // Serve the activity categories HTML page
});

// Admin Registration Route
app.post("/register", userController.registerAdmin);

// Tourist Registration Route
app.post("/register-tourist", touristController.registerTourist);

// Activity Category CRUD Routes
app.post(
  "/api/activity-category",
  activityCategoryController.createActivityCategory
);
app.get(
  "/api/activity-categories",
  activityCategoryController.getAllActivityCategories
);
app.put(
  "/api/activity-category/:id",
  activityCategoryController.updateActivityCategory
);
app.delete(
  "/api/activity-category/:id",
  activityCategoryController.deleteActivityCategory
);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
