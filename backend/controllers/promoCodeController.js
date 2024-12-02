import PromoCode from "../models/promoCodeModel.js";
import Tourist from "../models/touristModel.js";
import { sendBirthdayPromoCode } from "../utils/email.js";
import { notifyTouristBirthdayPromo } from './notificationController.js'; //
import { generatePromoCode } from "../utils/promoCodeGenerator.js"; 


// Create a new promo code
export const createPromoCode = async (req, res) => {
  const { promoCode, value } = req.body;
  try {
    const newPromoCode = new PromoCode({ promoCode, value });
    await newPromoCode.save();
    res.status(201).json({ message: 'Promo code created successfully!', promoCode: newPromoCode });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all promo codes
export const getAllPromoCodes = async (req, res) => {
  try {
    const promoCodes = await PromoCode.find();
    res.status(200).json(promoCodes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPromoCode = async (req, res) => {
    const {promoCode} = req.body;
  try {
    const promo = await PromoCode.find({promoCode : promoCode});
    if (!promo) return res.status(404).json({ message: 'Promo code not found' });
    res.status(200).json(promo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a promo code value by ID
export const updatePromoCode = async (req, res) => {
  const { value } = req.body;
  try {
    const promoCode = await PromoCode.findByIdAndUpdate(
      req.params.id,
      { value },
      { new: true, runValidators: true }
    );
    if (!promoCode) return res.status(404).json({ message: 'Promo code not found' });
    res.status(200).json({ message: 'Promo code updated successfully!', promoCode });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a promo code by ID
export const deletePromoCode = async (req, res) => {
  try {
    const promoCode = await PromoCode.findByIdAndDelete(req.params.id);
    if (!promoCode) return res.status(404).json({ message: 'Promo code not found' });
    res.status(200).json({ message: 'Promo code deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Promo code validity check
export const checkPromoCodeValidity = async (req, res) => {
  const { promoCode } = req.body;
  try {
    const foundPromo = await PromoCode.findOne({ promoCode });
    if (!foundPromo) return res.status(404).json({ message: 'Invalid promo code' });
    res.status(200).json({ message: 'Promo code is valid!', value: foundPromo.value });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendBirthdayPromoCodes = async () => {
  const today = new Date();
  console.log("today: ", today);
  const day = today.getDate();
  console.log("day: ", day);
  const month = today.getMonth() + 1; // Months are 0-indexed
  console.log("month: ", month);

  try {
    const tourists = await Tourist.find({
      dob: { $exists: true, $ne: null },
      birthdayPromoSent: false,
      $expr: {
          $and: [
              { $eq: [{ $dayOfMonth: "$dob" }, day] },
              { $eq: [{ $month: "$dob" }, month] }
          ]
      }
  });

      for (const tourist of tourists) {
        if (!tourist.email) {
          console.error(`No email found for tourist: ${tourist._id}`);
          continue; // Skip tourists without email
      }
          console.log(`Processing tourist: ${tourist._id}, Email: ${tourist.email}, DOB: ${tourist.dob}`);
          console.log('Sending birthday promo code to:', tourist.email);
          const promoCode = generatePromoCode(); 
          const value = 50; 
          const newPromoCode = new PromoCode({ promoCode, value });
          await newPromoCode.save();

          if (tourist.email) {
              console.log('Sending birthday promo code to:', tourist.email);
              await sendBirthdayPromoCode(tourist.email, promoCode);
          } else {
              console.error('No email address found for tourist:', tourist._id);
          }
          tourist.birthdayPromoSent = true;
          await notifyTouristBirthdayPromo(tourist._id, promoCode); // Call the new function
      }
  } catch (error) {
      console.error('Error sending birthday promo codes:', error);
  }
};