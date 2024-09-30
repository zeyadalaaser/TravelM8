import express from "express";
import path from "path";
import dotenv from "dotenv";
import activityCategoryRoute from "./routes/activityCategoryRoute.js";
import adminRoute from "./routes/adminRoute.js";
import preferenceTagRoute from "./routes/preferenceTagRoute.js";
import tourismGovernorRoute from "./routes/tourismGovernorRoute.js";
import { connectDB } from "./config/db.js";

dotenv.config({path:'../.env'});

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.listen(PORT, () => {
  connectDB();
  console.log("Server started at http://localhost:" + PORT);
});


app.use(express.json()); // allows us to accept JSON data in the req.body
app.use(activityCategoryRoute);
app.use(adminRoute);
app.use(preferenceTagRoute);
app.use(tourismGovernorRoute); // Fixed route for tourists
app.use(activityRoute);


// app.use(express.static("frontend/public")); // Serve static files from the public directory inside frontend

// Serve HTML pages from the public folder
// app.get("/user", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/public/user.html")); // Landing page
// });

// app.get("/admin", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/public/index.html")); // Admin registration page
// });

// app.get("/tourist", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/public/index2.html")); // Tourist registration page
// });

// // New Route for Activity Categories
// app.get("/activityCategory", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/public/activities.html")); // Serve the activity categories HTML page
// });
// =======
