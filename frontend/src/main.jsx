import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
//import TouristPage from '@/pages/tourist/tourist-page.jsx';
import SignUpFormTourist from '@/pages/SignUp/signupTourist.jsx'
import TourGuide from '@/pages/TourGuide/tourguide.jsx'
import AdminPage from '@/pages/admin/admin-page.jsx'
import ProfileTemplate from '@/pages/TourGuide/profileTemplate.jsx'
import ItineraryManager from '/Users/arwataha/Documents/GitHub/TravelM8/frontend/src/pages/TourGuide/itinerary.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProfileTemplate/>} />
        <Route path="/admin" element={<AdminPage/>} />
        <Route path="/sign-up-tourist" element = {<SignUpFormTourist/>}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
