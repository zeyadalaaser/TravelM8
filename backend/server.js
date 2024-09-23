import express from "express";
import path from "path";
import dotenv from "dotenv"

dotenv.config();

import { connectDB } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(express.json()); // allows us to accept JSON data in the req.body


app.listen(PORT, () => {
	connectDB();
	console.log("Server started at http://localhost:" + PORT);
});