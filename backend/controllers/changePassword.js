import bcrypt from "bcrypt";
import Tourist from '../models/touristModel.js'; 
import TourismGovernor from "../models/tourismGovernorModel.js";
import TourGuide from "../models/tourguideModel.js"; 
import Seller from '../models/sellerModel.js';
import Advertiser from '../models/advertiserModel.js';
import Admin from '../models/adminModel.js';

const changeUserPassword = async (userId, currentPassword, newPassword, confirmNewPassword, UserModel) => {
    const user = await UserModel.findById(userId);
    if (!user) {
        throw new Error('User not found.');
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
         throw new Error('Current password is incorrect.');
    }
    if (newPassword==confirmNewPassword) {
      user.password = newPassword;
      await user.save();
      return { message: 'Password changed successfully.' }; 
    }
    else {
      return { message: 'New Password and Confirm Password do not match' }; 
    }
};


const changeAccountPassword = async (userId, currentPassword, newPassword, confirmNewPassword, UserModel) => {
  const user = await UserModel.findById(userId);
  if (!user) {
      throw new Error('User not found.');
  }
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
       throw new Error('Current password is incorrect.');
  }
  if (newPassword==confirmNewPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return { message: 'Password changed successfully.' }; 
  }
  else {
    return { message: 'New Password and Confirm Password do not match' }; 
  }
};

export const changePasswordTourist = async (req,res) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const userId = req.user.userId; 
    try {
      const result = await changeUserPassword(userId, currentPassword, newPassword, confirmNewPassword, Tourist);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
}

export const changePasswordTourismGovernor = async (req,res) => {
    const { currentPassword, newPassword, confirmNewPassword  } = req.body;
    const userId = req.user.userId; 
    try {
      const result = await changeAccountPassword(userId, currentPassword, newPassword, confirmNewPassword, TourismGovernor);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
}

export const changePasswordTourGuide = async (req,res) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const userId = req.user.userId; 
    try {
      const result = await changeAccountPassword(userId, currentPassword, newPassword, confirmNewPassword, TourGuide);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
}


export const changePasswordSeller = async (req,res) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const userId = req.user.userId; 
    try {
      const result = await changeUserPassword(userId, currentPassword, newPassword, confirmNewPassword, Seller);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
}


export const changePasswordAdvertiser = async (req,res) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const userId = req.user.userId; 
    try {
      const result = await changeUserPassword(userId, currentPassword, newPassword,confirmNewPassword, Advertiser);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
}

export const changePasswordAdmin= async (req,res) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const userId = req.user.userId; 
    try {
      const result = await changeAccountPassword(userId, currentPassword, newPassword, confirmNewPassword, Admin);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
}

