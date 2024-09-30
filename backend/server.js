import express from "express";
import path from "path";
import dotenv from "dotenv"
import activityRoute from "/routes/activityRoute.js"
import historicalPlacesRoute from "../backend/routes/historicalPlacesRoute.js"

dotenv.config({path:'../.env'});

import { connectDB } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(express.json()); // allows us to accept JSON data in the req.body
app.use(activityRoute);
app.use(historicalPlacesRoute);


app.listen(PORT, () => {
	connectDB();
	console.log("Server started at http://localhost:" + PORT);
});