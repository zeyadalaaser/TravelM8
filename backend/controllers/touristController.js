import Tourist from '../models/touristModel.js'; // Update the path to point to the correct model file
import bcrypt from 'bcrypt';

export const registerTourist = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingTourist = await Tourist.findOne({ username });
    if (existingTourist) {
      return res
        .status(400)
        .json({ message: "Username already taken for tourists" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newTourist = new Tourist({ username, password: hashedPassword });
    await newTourist.save();

    res.status(201).json({ message: "Tourist registered successfully" });
  } catch (error) {
    console.error("Tourist registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//module.exports = { registerTourist };
