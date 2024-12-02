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
import Rating from '../models/ratingModel.js';


export const registerAdmin = async (req, res) => {
    const { username, password, email } = req.body;

    // Check for unique username and email
    const isNotUniqueUsername = await checkUniqueUsername(username);
    const isNotUniqueEmail = await Admin.findOne({ email });

    if (isNotUniqueUsername) {
        return res.status(400).json({ message: 'Username is already in use.' });
    }

    if (isNotUniqueEmail) {
        return res.status(400).json({ message: 'Email is already in use.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ username, password: hashedPassword, email });
        await newAdmin.save();
        res.status(201).json({ message: "Admin registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const deleteAccount = async (req, res) => {
    const { username, type } = req.body; // Get username and user type from request body

    if (!username || !type) {
        return res.status(400).send('Username and user type are required');
    }

    try {
        let result;

        // Handle each user type case explicitly
        switch (type) {
            case 'Admin':
                result = await Admin.findOneAndDelete({ username });
                break;

            case 'Tourist':
                result = await Tourist.findOneAndDelete({ username });
                break;

            case 'TourGuide':
                result = await TourGuide.findOneAndDelete({ username });
                if (result) {
                    await Itinerary.deleteMany({ tourGuideId: result._id });
                }
                break;

            case 'TourismGovernor':
                result = await TourismGovernor.findOneAndDelete({ username });
                if (result) {
                    await HistoricalPlaces.deleteMany({ tourismGovernorId: result._id });
                }
                break;

            case 'Seller':
                result = await Seller.findOneAndDelete({ username });
                if (result) {
                    await Product.deleteMany({ sellerId: result._id });
                }
                break;

            case 'Advertiser':
                result = await Advertiser.findOneAndDelete({ username });
                if (result) {
                    await Activity.deleteMany({ advertiserId: result._id });
                }
                break;

            default:
                return res.status(400).json({ message: 'Invalid user type' });
        }

        // If no user was found, return 404
        if (!result) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getUsers = async (req, res) => {
    try {
        const admins = await Admin.find({}, 'username email');
        const tourists = await Tourist.find({}, 'username');
        const tourGuides = await TourGuide.find({}, 'username');
        const sellers = await Seller.find({}, 'username');
        const advertisers = await Advertiser.find({}, 'username');

        const users = [
            ...admins.map(user => ({ username: user.username, email: user.email, type: 'Admin' })),
            ...tourists.map(user => ({ username: user.username, type: 'Tourist' })),
            ...tourGuides.map(user => ({ username: user.username, type: 'TourGuide' })),
            ...sellers.map(user => ({ username: user.username, type: 'Seller' })),
            ...advertisers.map(user => ({ username: user.username, type: 'Advertiser' })),
        ];

        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching users" });
    }
};

export const getAllAdmins = async (req, res) => {
    try {
        const allAdmins = await Admin.find({}, 'username email createdAt updatedAt'); 
        res.status(200).json(allAdmins);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};


export const getUsersReport = async (req, res) => {
    try {
        const aggregate = [
            {
                $project: {
                    year: { $year: '$createdAt' },  // Extract year from createdAt
                    month: { $month: '$createdAt' }, // Extract month from createdAt
                }
            },
            {
                $group: {
                    _id: { year: '$year', month: '$month' },  // Group by year and month
                    count: { $sum: 1 },  // Count the number of users in each group
                }
            },
            {
                $project: {
                    _id: 0,  // Exclude the _id field
                    year: '$_id.year',  // Add year to the result
                    month: '$_id.month',  // Add month to the result
                    usersCount: '$count',  // Rename count to usersCount
                }
            },
            {
                $sort: { 'year': 1, 'month': 1 },  // Sort by year and month in ascending order
            },
        ];


        const admins = await Admin.aggregate(aggregate);
        const tourismGovernors = await TourismGovernor.aggregate(aggregate);
        const tourists = await Tourist.aggregate(aggregate);
        const tourGuides = await TourGuide.aggregate(aggregate);
        const sellers = await Seller.aggregate(aggregate);
        const advertisers = await Advertiser.aggregate(aggregate);

        const result = { admins, tourismGovernors, advertisers, tourists, sellers, tourGuides }; // Combine all into one array

        res.status(200).json({ data: result, message: "Successfully fetched users info" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch info" });
    }
}

export const getSalesReport = async (req, res) => {

}