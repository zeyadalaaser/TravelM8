import express from "express";
import path from "path";
import dotenv from "dotenv"
import routerAdvertiser from './routes/advertiserRoute.js';
import routerSeller from './routes/sellerRoute.js';

dotenv.config({path:'../.env'});

import { connectDB } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 5001;

const __dirname = path.resolve();

app.use(express.json()); // allows us to accept JSON data in the req.body
app.get("/",(req,res) => {
	res.send("Server is ready");
});

app.listen(PORT, () => {
	connectDB();
	console.log("Server started at http://localhost:" + PORT);
});

app.use( routerAdvertiser);
app.use( routerSeller);