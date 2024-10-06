import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import SignUpForm from '@/pages/SignUp/signupTourist.jsx'
// import AdminPage from '@/pages/admin/admin-page.jsx'
import ProfileTemplate from '@/pages/TourGuide/profileTemplate.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProfileTemplate />} />
        {/* <Route path="/admin" element={<AdminPage/>} /> */}
        <Route path="/sign-up-tourist" element={<SignUpForm/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
