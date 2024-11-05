import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import axios from "axios";

export function RedeemPoints({ onClose }) {
  const token = localStorage.getItem('token');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    // Fetch user profile data when the component mounts
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/tourists/myProfile', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        // Assuming the response includes points and wallet fields
        const { loyaltyPoints, wallet } = response.data; // Adjust according to your schema
        setTotalPoints(loyaltyPoints);
        setWalletBalance(wallet);
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert(`Failed to fetch user data: ${error.response?.data?.message || error.message}`);
      }
    };

    fetchUserData();
  }, [token]);

  const handleRedeemClick = async () => {
    if (totalPoints <= 0) {
      alert("You don't have any points to redeem.");
      return;
    }

    setIsRedeeming(true);

    try {
      const response = await axios.put('http://localhost:5001/api/redeemPoints', {}, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const { wallet   } = response.data;

      alert(`Points redeemed successfully! You wallet balance is  ${wallet } EGP.`);
      setWalletBalance(wallet);
      setTotalPoints(0); // Reset points after redeeming
      onClose();
    } catch (error) {
      console.error("Error redeeming points:", error);
      alert(`Failed to redeem points: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
        <h2 className="text-2xl font-bold mb-4">Redeem Your Points</h2>
        <p className="mb-4">Total Points: {totalPoints}</p>
        <p className="mb-4">Wallet Balance: {walletBalance } EGP</p>
        <Button onClick={handleRedeemClick} disabled={isRedeeming  } className="w-full">
          {isRedeeming ? "Processing..." : "Redeem All Points"}
        </Button>
      </div>
    </div>
  );
}
