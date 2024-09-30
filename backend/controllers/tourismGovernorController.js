import TourismGovernor from "../models/tourismGovernorModel.js"; // Ensure the path is correct
import bcrypt from "bcrypt";

const registerGovernor = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username already exists
    const existingGovernor = await TourismGovernor.findOne({ username });
    if (existingGovernor) {
      return res
        .status(400)
        .json({ message: "Username already taken for tourists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new TourismGovernor
    const newTourismGovernor = new TourismGovernor({
      username,
      password: hashedPassword,
    });
    await newTourismGovernor.save();

    res.status(201).json({ message: "Tourist registered successfully" });
  } catch (error) {
    console.error("Tourist registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {registerGovernor};
