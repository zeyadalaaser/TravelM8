import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
//import TouristPage from '@/pages/tourist/tourist-page.jsx';
import SignUpForm from '@/pages/SignUp/signupTourist.jsx'
//import ProfileTemplate from './profileTemplate.jsx'
import AdminPage from '@/pages/admin/admin-page.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUpForm />} />
        <Route path="/admin" element={<AdminPage/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
