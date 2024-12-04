"use client"
import { useState, useMemo, useEffect } from "react";
import { Wallet, Star, Award } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import { toast } from "sonner";

export default function RedeemPoints() {
  const token = localStorage.getItem('token');
  const [points, setPoints] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [redeemAmount, setRedeemAmount] = useState("");
  const [level, setLevel] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Fetch user data (points, wallet balance, and level) from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/tourists/myProfile', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        const { loyaltyPoints, wallet, badgeLevel } = response.data;  
        setPoints(loyaltyPoints);
        setWalletBalance(wallet);
        setLevel(badgeLevel);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast(`Failed to fetch user data: ${error.response?.data?.message || error.message}`);
      }
    };

    fetchUserData();
  }, [token]);

  // Calculate progress for level and next level
  const { currentLevel, nextLevel, progress } = useMemo(() => {
    const levels = [
      { name: "Level 1", minPoints: 0, color: "bg-amber-600" },
      { name: "Level 2", minPoints: 100000, color: "bg-gray-400" },
      { name: "Level 3", minPoints: 500000, color: "bg-yellow-400" },
    ];

    const currentLevel = levels.reduce((acc, level) => (points >= level.minPoints ? level : acc), levels[0]);
    const nextLevelIndex = levels.indexOf(currentLevel) + 1;
    const nextLevel = nextLevelIndex < levels.length ? levels[nextLevelIndex] : null;
    const progress = nextLevel ? ((points - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100 : 100;

    return { currentLevel, nextLevel, progress };
  }, [points]);

  // Redeem points
  const handleRedeem = async (amount) => {
    if (amount && amount <= points) {
      try {
        // Redeem points (call backend)
        await axios.put('http://localhost:5001/api/redeemPoints', { amount }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        toast("points redeemed successfully");
        const response = await axios.get('http://localhost:5001/api/tourists/myProfile', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const { loyaltyPoints, wallet, badgeLevel } = response.data;
        setPoints(loyaltyPoints);
        setWalletBalance(wallet);
        setLevel(badgeLevel);
        setRedeemAmount("");
        setIsOpen(false);
      } catch (error) {
        console.error("Error redeeming points:", error);
        toast(`Failed to redeem points: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const handleRedeemAll = () => {
    handleRedeem(points);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Your Loyalty Points</CardTitle>
        <CardDescription>View your points, level, and wallet balance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
          <div className="flex items-center space-x-3">
            <Star className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm font-medium">Loyalty Points</p>
              <p className="text-2xl font-bold">{points}</p>
            </div>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Redeem</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg rounded-lg p-6 min-h-[350px]">
              <DialogHeader>
                <DialogTitle className="text-center text-xl">Redeem Points</DialogTitle>
                <DialogDescription className="text-base">
                  Enter the amount of points you want to redeem or redeem all points. 100 points = $1.00
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center justify-between gap-4">
                  <Label htmlFor="points" className="text-lg font-medium">
                    Points:
                  </Label>
                  <Input
                    id="points"
                    type="number"
                    className="text-center h-9"
                    value={redeemAmount}
                    onChange={(e) => setRedeemAmount(e.target.value)}
                    placeholder="Enter points"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => handleRedeem(parseInt(redeemAmount))}
                  className="w-full"
                >
                  Redeem Points
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleRedeemAll}
                  className="w-full"
                >
                  Redeem All Points
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center justify-between p-4 bg-secondary/10 rounded-lg">
          <div className="flex items-center space-x-3">
            <Award />
            <div>
              <p className="text-sm font-medium">Current Level</p>
              <p className="text-2xl font-bold">{level}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">Next Level</p>
            <p className="text-lg font-semibold">{nextLevel ? nextLevel.name : 'Max Level'}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{currentLevel.name}</span>
            <span>{nextLevel ? nextLevel.name : 'Max Level'}</span>
          </div>
          <div className="relative w-full h-2 bg-gray-300 rounded">
            <div className="absolute top-0 left-0 h-full bg-primary rounded"
                 style={{ width: `${progress}%` }} />
          </div>
          {nextLevel && (
            <p className="text-sm text-center">
              {nextLevel.minPoints - points} points to {nextLevel.name}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between p-4 bg-secondary/10 rounded-lg">
          <div className="flex items-center space-x-3">
            <Wallet />
            <div>
              <p className="text-sm font-medium">Wallet Balance</p>
              <p className="text-2xl font-bold">${walletBalance.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
