// controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/adminModel.js';
import Tourist from '../models/touristModel.js';
import TourGuide from '../models/tourguideModel.js';
import Advertiser from '../models/advertiserModel.js';
import TourismGovernor from '../models/tourismGovernorModel.js';
import Seller from '../models/sellerModel.js';

// export const login = async (req, res) => {
//     const { username, password } = req.body;

//     // Check if the user exists in any model
//     let user = await Admin.findOne({ username }) || 
//                await Tourist.findOne({ username }) ||
//                await TourGuide.findOne({ username }) ||
//                await Advertiser.findOne({ username }) ||
//                await TourismGovernor.findOne({ username }) ||
//                await Seller.findOne({ username });

//     if (!user) {
//         return res.status(400).json({ msg: "User not found" });
//     }

//     // Validate password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//         return res.status(400).json({ msg: "Invalid credentials" });
//     }

//     // Create a JWT
//     const payload = {
//         userId: user._id,
//         role: user.role
//     };

//     const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

//     res.json({ token, role: user.role });
// };


// controllers/authController.js
const secret = "a$T8#fGz!x7%kH4q";


export const login = async (req, res) => {
    const { username, password } = req.body;

    // Create an array of user queries with roles
    const userQueries = [
        { model: Admin, role: 'Admin' },
        { model: Tourist, role: 'Tourist' },
        { model: TourGuide, role: 'TourGuide' },
        { model: Advertiser, role: 'Advertiser' },
        { model: TourismGovernor, role: 'TourismGovernor' },
        { model: Seller, role: 'Seller' }
    ];

    // Execute all queries concurrently
    const userPromises = userQueries.map(async ({ model, role }) => {
        const user = await model.findOne({ username });
        return user ? { user, role, username } : null; // Return user with role if found
    });

    // Wait for all promises to resolve
    const results = await Promise.all(userPromises);
    
    // Find the first non-null result
    const foundUser = results.find(result => result !== null);

    // If no user found, return error
    if (!foundUser) {
        return res.status(400).json({ msg: "Invalid username" });
    }

    const { user, role  } = foundUser;

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ msg: "Incorrect password" });
    }
    console.log("User role:", user.role);
    console.log("User preferences:", user.preferences);
    const needsPreferences =  
                         (!user.preferences || 
                          Object.entries(user.preferences)
                                .filter(([key]) => key !== 'budget') 
                                .every(([, value]) => value === false));

   console.log("needsPreferences evaluated to:", needsPreferences);
// Create a JWT
    const payload = {
        userId: user._id,
        role, // Use the determined role
        username
    };

    console.log(payload);
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    res.json({ token, role, needsPreferences });
};
