import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import TouristPage from '@/pages/tourist/tourist-page.jsx';
import TourGuide from '@/pages/TourGuide/tourguide.jsx'
import Login from '@/pages/SignIn/Login.jsx'; 
import SignupGeneral from '@/pages/SignUp/SignupGeneral.jsx';
import TouristRegistration from '@/pages/SignUp/signupTourist.jsx'
import FormPage from '@/pages/SignUp/signupTourguide.jsx';
import FormPageSeller from '@/pages/SignUp/signupSeller.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'

//import TourismGovernor from "@/pages/TourismGovernor/TourismGovernorDashboard.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<App/>} />
        <Route path="login" element={<Login />} />
        <Route path="/signup" element={<SignupGeneral />} />
        <Route path="/signup/signupTourist" element={<TouristRegistration />} />
        <Route path="/signup/signupTourguide" element={<FormPage />} />
        <Route path="/signup/signupSeller" element={<FormPageSeller />} />
        <Route path="/tourist-page" element={<TouristPage />} />

      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
