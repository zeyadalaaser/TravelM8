import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate 3alashan kol user yeroo7 lel page ely el mafrood yero7ha

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate(); // Initialize navigate function

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Send a POST request to the backend to authenticate the user
      const response = await axios.post('http://localhost:5001/api/auth/login', {
        username,
        password
      });

      // If successful, you can store the token and navigate the user
      const { token, role } = response.data;
      localStorage.setItem('token', token); // Store JWT token in localStorage

      console.log("Login successful. Role:", role);
      console.log("token:", token);

      // Redirect to different pages based on role
      if (role === 'Tourist') {
        navigate('/tourist-page'); // Tourist role
      } else if (role === 'Seller') {
        navigate('/SellerProfile'); // Seller role
      } else if (role === 'TourGuide') {
        navigate('/tourGuideDashboard');
    } else if (role === 'TourismGovernor') {
        navigate('/TourismGovernorDashboard');
      } else if (role === 'Admin') {
        navigate('/dashboard');
      } else if (role === 'Advertiser') {
        navigate('/advertiserDashboard');
      } else {
        navigate('/default-page'); // Default page if role doesn't match
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.msg || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                type="text" 
                placeholder="Enter your username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Log in</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
