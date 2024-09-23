import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();

export const connectDB = async () => {
	// console.log("MongoDB URI:", process.env.MONGO_URI);
	try {
		const conn = await mongoose.connect("mongodb+srv://team:Team1234@cluster0.befui0o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
		console.log("MongoDB Connection successful!");
	} catch (error) {
		console.log("Connection Failed:", error);
        process.exit(1);
	}
};