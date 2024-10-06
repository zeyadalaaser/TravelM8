// controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/adminModel.js';
import Tourist from '../models/touristModel.js';
import TourGuide from '../models/tourguideModel.js';
import Advertiser from '../models/advertiserModel.js';
import TourismGovernor from '../models/tourismGovernorModel.js';
import Seller from '../models/sellerModel.js';

export const login = async (req, res) => {
    const { username, password } = req.body;

    // Check if the user exists in any model
    let user = await Admin.findOne({ username }) || 
               await Tourist.findOne({ username }) ||
               await TourGuide.findOne({ username }) ||
               await Advertiser.findOne({ username }) ||
               await TourismGovernor.findOne({ username }) ||
               await Seller.findOne({ username });

    if (!user) {
        return res.status(400).json({ msg: "User not found" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Create a JWT
    const payload = {
        userId: user._id,
        role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, role: user.role });
};
