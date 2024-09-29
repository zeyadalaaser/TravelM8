import TouristGovernor from "../models/touristModel.js"; // Ensure the path is correct
import bcrypt from "bcrypt";

export const registerTourist = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username already exists
    const existingTourist = await TouristGovernor.findOne({ username });
    if (existingTourist) {
      return res
        .status(400)
        .json({ message: "Username already taken for tourists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new touristGovernor
    const newTouristGovernor = new TouristGovernor({
      username,
      password: hashedPassword,
    });
    await newTouristGovernor.save();

    res.status(201).json({ message: "Tourist registered successfully" });
  } catch (error) {
    console.error("Tourist registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
