import React, { useState } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = ({ isOpen, onOpenChange, onBackToLogin }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRequestOTP = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      await axios.post('http://localhost:5001/api/auth/request-password-reset', { email });
      setIsLoading(false);
      setStep(2);
    } catch (error) {
      setIsLoading(false);
      setMessage(error.response?.data?.msg || 'Failed to send OTP.');
    }
  };

  const handleVerifyOTP = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      await axios.post('http://localhost:5001/api/auth/verify-otp', { email, otp });
      setIsLoading(false);
      setStep(3);
    } catch (error) {
      setIsLoading(false);
      setMessage(error.response?.data?.msg || 'Invalid OTP.');
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (newPassword !== confirmNewPassword) {
      setMessage("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:5001/api/auth/reset-password', { email, otp, newPassword, confirmNewPassword });
      setIsLoading(false);
      setMessage('Password reset successfully. Redirecting to home page in 3 seconds...');
      setTimeout(() => {
        navigate('/');
        onOpenChange(false); // Close the dialog
      }, 3000);
    } catch (error) {
      setIsLoading(false);
      setMessage(error.response?.data?.msg || 'Failed to reset password.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full bg-gray-100">
        <DialogHeader className="flex flex-col items-center text-center">
          <DialogTitle className="text-2xl font-medium">Reset Password</DialogTitle>
          <DialogDescription className="text-gray-600">
            {step === 1 && "Enter your email to receive a password reset OTP"}
            {step === 2 && "Enter the OTP sent to your email"}
            {step === 3 && "Enter your new password"}
          </DialogDescription>
        </DialogHeader>
        <div className="bg-white bg-opacity-80 rounded-xl shadow-2xl p-8">
          <div className="flex justify-center mb-6">
            <img src="/placeholder.svg?height=60&width=200" alt="TravelM8 Travels Logo" width={200} height={60} />
          </div>
          {step === 1 && (
            <form onSubmit={handleRequestOTP}>
              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <Button
                  type="submit"
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition duration-150"
                  disabled={isLoading}
                >
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : "Send OTP"}
                </Button>
              </div>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP}>
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <Button
                  type="submit"
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition duration-150"
                  disabled={isLoading}
                >
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : "Verify OTP"}
                </Button>
              </div>
            </form>
          )}
          {step === 3 && (
            <form onSubmit={handleResetPassword}>
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </Button>
                </div>
                <Input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <Button
                  type="submit"
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition duration-150"
                  disabled={isLoading}
                >
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : "Reset Password"}
                </Button>
              </div>
            </form>
          )}
          {message && <p className="mt-4 text-center font-medium text-red-500">{message}</p>}
          <div className="mt-4 text-center">
            <Button
              type="button"
              variant="link"
              className="text-sm text-gray-600 hover:underline"
              onClick={() => {
                onOpenChange(false);
                onBackToLogin();
              }}
            >
              Back to Login
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPassword;

