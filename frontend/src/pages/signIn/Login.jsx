import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', {
        username,
        password
      });

      const { token, role, needsPreferences } = response.data;
      localStorage.setItem('token', token);

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id || decodedToken.userId;

      console.log("User ID:", userId);
      localStorage.setItem('userId', userId);

      console.log("Login successful. Role:", role);
      console.log("token:", token);
      console.log("pref: ", needsPreferences);


      if (needsPreferences && role === 'Tourist') {
        navigate(`/preferences-page/${userId}`);
      } else {
        switch (role) {
          case 'Tourist':
            navigate('/tourist-page');
            break;
          case 'Seller':
            navigate('/Sellerdashboard');
            break;
          case 'TourGuide':
            navigate('/tourGuideDashboard');
            break;
          case 'TourismGovernor':
            navigate('/TourismGovernorDashboard');
            break;
          case 'Admin':
            navigate('/AdminDashboard');
            break;
          case 'Advertiser':
            navigate('/advertiserDashboard');
            break;
          default:
            navigate('/');
        }

      }
    } catch (error) {
      setErrorMessage(error.response?.data?.msg || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <Card className="w-full max-w-md bg-white shadow-2xl rounded-lg p-6 transform transition duration-300 ease-in-out hover:shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-4xl font-extrabold text-gray-800">Sign In</CardTitle>
          <CardDescription className="text-gray-600">Access your account to explore</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-1">
              <Label htmlFor="username" className="text-gray-700 font-medium">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-gray-100 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-100 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
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
            </div>
            {errorMessage && <p className="text-red-500 text-center font-semibold">{errorMessage}</p>}
          </CardContent>
          <CardFooter className="pt-6">
            <Button
              type="submit"
              className="w-full bg-black text-white font-semibold py-2 rounded-md transition duration-300 hover:bg-gray-800"
            >
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
