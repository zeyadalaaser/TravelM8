import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import express from "express";
import Tourist from '../models/touristModel.js'; 
import TourismGovernor from "../models/tourismGovernorModel.js";
import TourGuide from "../models/tourguideModel.js"; 
import Seller from '../models/sellerModel.js';
import Advertiser from '../models/advertiserModel.js';
import Admin from '../models/adminModel.js';

const changeUserPassword = async (userId, currentPassword, newPassword, UserModel) => {
    const user = await UserModel.findById(userId);
    if (!user) {
        console.log(userId);
        throw new Error('User not found.');
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      // const tempPassword = "Password16";
      // const hashedPassword = await bcrypt.hash(tempPassword, 10);
      // console.log(hashedPassword);
         throw new Error('Current password is incorrect.');
    }
    user.password = newPassword;
    await user.save();
    return { message: 'Password changed successfully.' };
};

export const changePasswordTourist = async (req,res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId; 
    try {
      const result = await changeUserPassword(userId, currentPassword, newPassword, Tourist);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
}

export const changePasswordTourismGovernor = async (req,res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id; 
    try {
      const result = await changeUserPassword(userId, currentPassword, newPassword, TourismGovernor);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
}

export const changePasswordTourGuide = async (req,res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id; 
    try {
      const result = await changeUserPassword(userId, currentPassword, newPassword, TourGuide);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
}


export const changePasswordSeller = async (req,res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id; 
    try {
      const result = await changeUserPassword(userId, currentPassword, newPassword, Seller);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
}


export const changePasswordAdvertiser = async (req,res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id; 
    try {
      const result = await changeUserPassword(userId, currentPassword, newPassword, Advertiser);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
}

export const changePasswordAdmin= async (req,res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id; 
    try {
      const result = await changeUserPassword(userId, currentPassword, newPassword, Admin);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
}

