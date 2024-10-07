import Tourist from '../models/touristModel.js'; 
import { checkUniqueUsernameEmail } from "../helpers/signupHelper.js"; 
import bcrypt from 'bcryptjs';




export const createTourist = async(req,res) => {
   //add a new Tourist to the database with 
   const {username, name, email, password, mobileNumber, nationality, dob, occupation} = req.body;
   const isNotUnique = await checkUniqueUsernameEmail(username, email);

        if (isNotUnique) {
            return res.status(400).json({ message: 'Username or email is already in use.' });
        }
   try{
  
      const tourist = await Tourist.create({username, email, password, mobileNumber, nationality, dob, occupation});
      res.status(200).json(tourist);
   }catch(error){
      res.status(400).json({error:error.message});
   }
}


export const updateTouristProfile = async (req, res) => {
   const userId = req.user.userId;
   try{
       // Check if the password is being updated and hash it if so
    if (req.body.password) {
      req.body.password = await hashPassword(req.body.password);
    }

      const updatedTourist = await Tourist.findByIdAndUpdate(
         userId,        
         req.body,         
         { new: true, runValidators: true }          
       );
       if (!updatedTourist){
         res.status(400).json({error:error.message});
       }
      res.status(200).json(updatedTourist);
   }catch(error){
      res.status(400).json({error:error.message});
   }
};


  export const getTourists = async (req, res) => {
    //retrieve all users from the database
    try{
       const Tourists = await Tourist.find({});
       res.status(200).json(Tourists);
    }catch(error){
       res.status(400).json({error:error.message});
    }
 }

 export const getMyProfile = async (req, res) => {
   const userId = req.user.userId;
   try {
      const touristInfo = await Tourist.findById(userId);
      res.status(200).json(touristInfo);
   } catch (error) {
      res.status(400).json({ message: "could not fetch account information" });
   }
}

