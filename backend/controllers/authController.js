import OTP from '../models/otpModel.js';
import { sendOTP } from '../utils/email.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import Admin from '../models/adminModel.js';
import Tourist from '../models/touristModel.js';
import TourGuide from '../models/tourguideModel.js';
import Advertiser from '../models/advertiserModel.js';
import TourismGovernor from '../models/tourismGovernorModel.js';
import Seller from '../models/sellerModel.js';

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ msg: "Email is required." });
  }

  const user = await Admin.findOne({ email: email.toLowerCase() })
  || await Tourist.findOne({ email: email.toLowerCase() })
  || await TourGuide.findOne({ email: email.toLowerCase() })
  || await Advertiser.findOne({ email: email.toLowerCase() })
  || await TourismGovernor.findOne({ email: email.toLowerCase() })
  || await Seller.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.status(404).json({ msg: "No account found with this email." });
  }

  const otp = crypto.randomInt(100000, 999999).toString();  ////6 digits

  // Save OTP in the database
  await OTP.create({ email, otp });

  // Send OTP to user's email
  await sendOTP(email, otp);

  res.status(200).json({ msg: "OTP has been sent to your email." });
};
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmNewPassword } = req.body;

    // Validate input
    if (!email || !otp || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ msg: "All fields are required." });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ msg: "Passwords do not match." });
    }

    const emailLower = email.toLowerCase();

    // Find OTP record
    const otpRecord = await OTP.findOne({ email: emailLower });
    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ msg: "Invalid or expired OTP." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password for the correct user
    await Promise.any([
      Admin.updateOne({ email: emailLower }, { password: hashedPassword }),
      Tourist.updateOne({ email: emailLower }, { password: hashedPassword }),
      TourGuide.updateOne({ email: emailLower }, { password: hashedPassword }),
      Advertiser.updateOne({ email: emailLower }, { password: hashedPassword }),
      TourismGovernor.updateOne({ email: emailLower }, { password: hashedPassword }),
      Seller.updateOne({ email: emailLower }, { password: hashedPassword }),
    ]);

    // Delete the OTP after successful reset
    await OTP.deleteOne({ email: emailLower });

    res.status(200).json({ msg: "Password reset successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error." });
  }
};


  export const verifyOTP = async (req, res) => {
    try {
      const { email, otp } = req.body;
  
      if (!email || !otp) {
        return res.status(400).json({ msg: "Email and OTP are required." });
      }
  
      const emailLower = email.toLowerCase();
  
      // Find OTP record
      const otpRecord = await OTP.findOne({ email: emailLower });
      if (!otpRecord) {
        return res.status(400).json({ msg: "Invalid or expired OTP." });
      }
  
      // Check if OTP matches
      if (otpRecord.otp !== otp) {
        return res.status(400).json({ msg: "Incorrect OTP." });
      }
  
      res.status(200).json({ msg: "OTP verified successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Server error." });
    }
  };
  