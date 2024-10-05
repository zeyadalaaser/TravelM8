import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import TouristPage from '@/pages/tourist/tourist-page.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/tourist" element={<TouristPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
