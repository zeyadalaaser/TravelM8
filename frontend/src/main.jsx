import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
//import TouristPage from '@/pages/tourist/tourist-page.jsx';
//import SignUpForm from './signupTourist.jsx'
//import ProfileTemplate from './profileTemplate.jsx'
//import AdminDashboard from './pages/admin/dashboard.jsx'
//import DeleteUser from './pages/admin/deleteUser-page.jsx';
import PreferenceTag from '../../backend/models/preferenceTagModel.js';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/preferenceTag" element={<PreferenceTag/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
