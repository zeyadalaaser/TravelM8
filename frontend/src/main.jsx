import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import SignUpForm from '@/pages/SignUp/signupTourist.jsx'
//import ProfileTemplate from '@/pages/TourGuide/profileTemplate.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import TouristPage from './pages/tourist/tourist-page.jsx'
import DeleteUser from './pages/admin/deleteUser-page.jsx'
import PreferenceTag from './pages/admin/preferenceTag-page.jsx';
import Dashboard from './pages/admin/dashboard.jsx';
//import TourismGovernor from "@/pages/TourismGovernor/TourismGovernorDashboard.jsx"
//import "./styles/main.css";
import ActivityCategories from "./services/ActivityCategories"; // Ensure this path is correct
import Admin from "./services/Admin"; // Import the Admin component
import TourismGovernor from "./services/TourismGovernor";       

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        {/* <Route path="/admin" element={<AdminPage/>} /> */}
        <Route path="/sign-up-tourist" element={<SignUpForm/>} />
        <Route path="/tourist" element={<TouristPage/>} />
        <Route path="/deleteUser" element={<DeleteUser/>} />
        <Route path="/preferenceTag" element={<PreferenceTag/>} />
        <Route path="/dashboard" element={<Dashboard/>} />

        <Route path="/admin/addAdmin" element={<Admin />} />
          <Route path="/admin/EditActivityCategories" element={<ActivityCategories />} />
          <Route path="/admin/addTourismGovernor" element={<TourismGovernor />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
