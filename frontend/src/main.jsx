import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import SignUpForm from '@/pages/SignUp/signupTourist.jsx'
import ProfileTemplate from '@/pages/TourGuide/profileTemplate.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
<<<<<<< Updated upstream
import TouristPage from './pages/tourist/tourist-page.jsx'
=======
import TourismGovernor from "@/pages/TourismGovernor/TourismGovernorDashboard.jsx"
>>>>>>> Stashed changes

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TourismGovernor />} />
        {/* <Route path="/admin" element={<AdminPage/>} /> */}
        <Route path="/sign-up-tourist" element={<SignUpForm/>} />
        <Route path="/tourist" element={<TouristPage/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
