import React, { useState } from 'react';
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import ForgotPassword from './ForgetPassword';

const LoginPage = ({ children, isOpen, onOpenChange, onSignupClick, onLogin }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
    const navigate = useNavigate();
    const handleForgotPassword = () => {
        setIsForgotPasswordOpen(true);  // Open ForgotPassword dialog
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
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
            onOpenChange(false);
            onLogin();

            switch (role) {
                case 'Tourist':
                    navigate('/');
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
                    navigate('/default-page');
            }
            //window.location.reload();

        } catch (error) {
            setErrorMessage(error.response?.data?.msg || "Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>

                <DialogContent className="max-w-md w-full bg-gray-100">
                    <DialogHeader className="flex flex-col items-center text-center">
                        <DialogTitle className="text-2xl font-medium">WELCOME BACK</DialogTitle>
                        <DialogDescription className="text-gray-600">Don't have an account?{' '}
                            <Link
                                onClick={(e) => {
                                    e.preventDefault();
                                    onSignupClick();
                                }}
                                className="text-gray-600 underline hover:underline cursor-pointer"
                            >
                                Create new account
                            </Link>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="bg-white bg-opacity-80 rounded-xl shadow-2xl p-8">
                        <div className="flex justify-center mb-6">
                            <img src="/placeholder.svg?height=60&width=200" alt="TravelM8 Travels Logo" width={200} height={60} />
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <Input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                                />
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Input
                                            id="remember-me"
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="h-4 w-4 text-gray-300 focus:ring-grey-300 border-gray-300 rounded"
                                        />
                                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                            Remember me
                                        </label>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="link"
                                        className="text-sm text-gray-600 hover:underline"
                                        onClick={() => setIsForgotPasswordOpen(true)}
                                    >
                                        Forgot Password?
                                    </Button>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition duration-150"
                                    disabled={isLoading}
                                >
                                    {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                                </Button>
                                {errorMessage && <p className="text-red-500 font-medium">{errorMessage}</p>}
                            </div>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
            <ForgotPassword
                isOpen={isForgotPasswordOpen}
                onOpenChange={setIsForgotPasswordOpen}
            />
        </div>
    );
};

export default LoginPage;

