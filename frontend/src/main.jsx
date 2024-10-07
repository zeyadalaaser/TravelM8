import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import TouristPage from '@/pages/tourist/tourist-page.jsx';
import Login from '@/pages/SignIn/Login.jsx'; 
import SignupGeneral from '@/pages/SignUp/SignupGeneral.jsx';
import TouristRegistration from '@/pages/SignUp/signupTourist.jsx'
import FormPage from '@/pages/SignUp/signupTourguide.jsx';
import FormPageSeller from '@/pages/SignUp/signupSeller.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import TourismGovernor from "@/pages/TourismGovernor/TourismGovernorDashboard.jsx"
//import "./styles/main.css";
import ActivityCategories from "./services/ActivityCategories"; // Ensure this path is correct
import Admin from "./services/Admin"; // Import the Admin component
//import TourismGovernor from "./services/TourismGovernor";  
import DeleteUser from './pages/admin/deleteUser-page.jsx'
import PreferenceTag from './pages/admin/preferenceTag-page.jsx';
import Dashboard from './pages/admin/dashboard.jsx';  
 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        {/* <Route path="/admin" element={<AdminPage/>} /> */}
        <Route path="/tourist" element={<TouristPage/>} />
        <Route path="/deleteUser" element={<DeleteUser/>} />
        <Route path="/preferenceTag" element={<PreferenceTag/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/admin/addAdmin" element={<Admin />} />
        <Route path="/admin/EditActivityCategories" element={<ActivityCategories />} />
        <Route path="/admin/addTourismGovernor" element={<TourismGovernor />} />
        <Route path="login" element={<Login />} />
        <Route path="/signup" element={<SignupGeneral />} />
        <Route path="/signup/signupTourist" element={<TouristRegistration />} />
        <Route path="/signup/signupTourguide" element={<FormPage />} />
        <Route path="/signup/signupSeller" element={<FormPageSeller />} />
        <Route path="/tourist-page" element={<TouristPage />} />
        <Route path="/TourismGovernorDashboard" element={<TourismGovernor />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
