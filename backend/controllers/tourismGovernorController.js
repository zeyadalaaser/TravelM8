import TourismGovernor from "../models/tourismGovernorModel.js"; // Ensure the path is correct
import bcrypt from "bcrypt";
import { checkUniqueUsername } from "../helpers/signupHelper.js"; 

const registerGovernor = async (req, res) => {
  const { username, password } = req.body;
  const isNotUnique = await checkUniqueUsername(username);

        if (isNotUnique) {
            return res.status(400).json({ message: 'Username is already in use.' });
        }

  try {

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


const fetchTourismGovernors = async (req, res) => {
  try {
    const governors = await TourismGovernor.find({}, "username");
    res.status(200).json(governors);
  } catch (error) {
    console.error("Error fetching tourism governors:", error);
    res.status(500).json({ message: "Error fetching tourism governors." });
  }
};

export {registerGovernor, fetchTourismGovernors};
