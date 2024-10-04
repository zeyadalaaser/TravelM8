import Admin from '../models/adminModel.js';
import Tourist from '../models/touristModel.js';
import TourGuide from '../models/tourguideModel.js';
import Seller from '../models/sellerModel.js';
import Advertiser from '../models/advertiserModel.js';
import bcrypt from 'bcrypt';
import { checkUniqueUsername } from "../helpers/signupHelper.js"; 
import Itinerary from '../models/itineraryModel.js';
import Product from '../models/productModel.js';
import Activity from '../models/activityModel.js';
import TourismGovernor from '../models/tourismGovernorModel.js';
import HistoricalPlaces from '../models/historicalPlacesModel.js';


export const registerAdmin = async (req, res) => {
  const { username, password } = req.body;
  const isNotUnique = await checkUniqueUsername(username);

        if (isNotUnique) {
            return res.status(400).json({ message: 'Username is already in use.' });
        }

  try {

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Admin({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteAccount = async (req, res) => {
    const { username, type } = req.query; // Get username and user type from query

    if (!username || !type) {
        return res.status(400).send('Username and user type are required');
    }

    // Mapping of user types to their models and related deletion logic
    const userModels = {
        Admin,
        Tourist,
        TourGuide: {
            model: TourGuide,
            relatedDeletion: Itinerary,
            relatedField: 'tourGuideId'
        },
        TourismGovernor: {
            model: TourismGovernor,
            relatedDeletion: HistoricalPlaces,
            relatedField: 'tourismGovernorId'
        },
        Seller: {
            model: Seller,
            relatedDeletion: Product,
            relatedField: 'sellerId'
        },
        Advertiser: {
            model: Advertiser,
            relatedDeletion: Activity,
            relatedField: 'advertiserId'
        }
    };

    try {
        let result;

        // Check if the type exists in the mapping
        if (userModels[type]) {
            const userModel = userModels[type].model || userModels[type]; // Get the user model
            result = await userModel.findOneAndDelete({ username });

            // If a related deletion model exists, perform the deletion
            if (userModels[type].relatedDeletion && result) {
                await userModels[type].relatedDeletion.deleteMany({ [userModels[type].relatedField]: result._id });
            }
        } else {
            return res.status(400).send('Invalid user type');
        }

        if (!result) {
            return res.status(404).send('User not found');
        }

        res.status(200).send('User deleted successfully');
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send('Server error');
    }
};

