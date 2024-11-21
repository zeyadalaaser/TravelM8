import React, { useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoadingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate a loading delay before navigating to the logged-in page
    setTimeout(() => {// Navigate to the dashboard or logged-in page
    }, 2000); // Adjust the time as per your actual login process
  }, [navigate]);

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-white flex justify-center items-center z-50">
      <CircularProgress size={50} />
    </div>
  );
};

export default LoadingPage;
