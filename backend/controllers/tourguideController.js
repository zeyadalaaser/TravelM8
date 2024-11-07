import TourGuide from "../models/tourguideModel.js"; 
import Booking from '../models/bookingsModel.js';
import { checkUniqueUsernameEmail } from "../helpers/signupHelper.js"; 
import bcrypt from 'bcrypt';

export const createTourGuide = async(req,res) => {
   //add a new user to the database with 
   const {username, email, password} = req.body;
   const isNotUnique = await checkUniqueUsernameEmail(username, email);

        if (isNotUnique) {
            return res.status(400).json({ message: 'Username or email is already in use.' });
        }
   try{
      const hashedPassword = await bcrypt.hash(password, 10);
      const tourGuide = await TourGuide.create({username, email, password: hashedPassword});
      await tourGuide.save();
      res.status(200).json(tourGuide);
   }catch(error){
      res.status(400).json({error:error.message});
   }
}


export const updateTourGuideProfile = async (req, res) => {
   const userId = req.user.userId;
   try{
      const updatedAdvertiser = await TourGuide.findByIdAndUpdate(
         userId,
         req.body,
         { new: true, runValidators: true }
       );
       if (!updatedAdvertiser){
         res.status(400).json({error:error.message});
       }
      res.status(200).json(updatedAdvertiser);
   }catch(error){
      res.status(400).json({error:error.message});
   }
};


  export const getTourGuides = async (req, res) => {
    //retrieve all users from the database
    try{
       const tourGuides = await TourGuide.find({});
       res.status(200).json(tourGuides);
    }catch(error){
       res.status(400).json({error:error.message});
    }
 };
 
 export const getMyProfile = async (req, res) => {
   const userId = req.user.userId;
   try {
      const touristInfo = await TourGuide.findById(userId);
      res.status(200).json(touristInfo);
   } catch (error) {
      res.status(400).json({ message: "could not fetch account information" });
   }
}

export const rateTourGuide = async (req, res) => {
   const { tourGuideId, touristId, rating, comment } = req.body;
   try {
     const tourGuide = await TourGuide.findById(tourGuideId);
     if (!tourGuide) return res.status(404).json({ message: "Tour guide not found" });
 
     // Check if the tourist already rated the guide
     const existingRating = tourGuide.ratings.find(r => r.touristId.toString() === touristId);
     if (existingRating) {
       existingRating.rating = rating;
       existingRating.comment = comment;
     } else {
       tourGuide.ratings.push({ touristId, rating, comment });
     }
 
     await tourGuide.save();
     res.status(200).json({ message: "Rating and comment submitted successfully" });
   } catch (error) {
     res.status(500).json({ message: "Error submitting rating", error });
   }
 };