const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const registerAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteAccount = async (req, res) =>{
  const { username } = req.body;

  try {
    const deletedUser = await User.deleteOne({ username});
    if (deletedUser.deletedCount > 0) {
      return res.status(200).json({ message: "User deleted successfully" });
    } else {
      return res.status(404).json({ message: "User not found" });
    }

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }

}

module.exports = { registerAdmin, deleteAccount };
