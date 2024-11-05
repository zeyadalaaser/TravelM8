import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import TouristPage from "@/pages/tourist/tourist-page.jsx";
import Login from "@/pages/SignIn/Login.jsx";
import SignupGeneral from "@/pages/SignUp/SignupGeneral.jsx";
import TouristRegistration from "@/pages/SignUp/signupTourist.jsx";
import FormPage from "@/pages/SignUp/signupTourguide.jsx";
import FormPageSeller from "@/pages/SignUp/signupSeller.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import TourismGovernor from "@/pages/TourismGovernor/TourismGovernorDashboard.jsx";
import ActivityCategories from "@/pages/admin/services/ActivityCategories.jsx"; // Ensure this path is correct
import Admin from "@/pages/admin/services/Admin"; // Import the Admin component
import TourismGovernor1 from "@/pages/admin/services/TourismGovernor.jsx";
import DeleteUser from "./pages/admin/deleteUser-page.jsx";
import PreferenceTag from "./pages/admin/preferenceTag-page.jsx";
import Dashboard from "./pages/admin/dashboard.jsx";
import AdvertiserProfile from "./pages/Advertiser/advertiserProfile";
import AdvertiserActivities from "./pages/Advertiser/advertiserActivities";
import AdvertiserHomePage from "./pages/Advertiser/advertiserHomePage";
//import HistoricalPlacesList from '@/pages/TourismGovernor/HistoricalPlacesList.jsx';
import HistoricalPlaceForm from "@/pages/TourismGovernor/HistoricalPlaceForm.jsx";
import HistoricalPlaceDetails from "@/pages/TourismGovernor/HistoricalPlaceDetails.jsx";
//import ProductApp from './pages/admin/ProductApp.jsx'
//import ProductForm from './pages/admin/ProductForm.jsx'
//import ProductList from './pages/admin/ProductList.jsx'
import Product from "./pages/admin/product.jsx";
import ProfileTemplate from "./pages/TourGuide/profileTemplate.jsx";
import Itinerary from "./pages/TourGuide/itinerary2.jsx";
import TourGuideHomePage from "@/pages/TourGuide/tourguideHomePage.jsx";
import TouristProfile from "./pages/tourist/components/tourist-profile.jsx";
import AdvertiserRegistration from "@/pages/SignUp/signupAdvertiser.jsx";
import Itineraries from "@/pages/TourGuide/myItineraries.jsx";
import SellerProfile from "@/pages/seller/SellerProfile.jsx";
import SellerProducts from "@/pages/seller/SellerProducts.jsx";
import ComplaintsPage from "@/pages/admin/complaints.jsx";
import { ProductsPage } from "./pages/tourist/components/products/products-page.jsx";
import PurchasedProductsPage from "@/pages/tourist/components/products/PurchasedProductsPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        {/* <Route path="/admin" element={<AdminPage/>} /> */}
        <Route path="/SellerProduct" element={<SellerProducts />} />
        <Route path="/SellerProfile" element={<SellerProfile />} />
        <Route path="/tourist" element={<TouristPage />} />
        <Route path="/myItineraries" element={<Itineraries />} />
        <Route path="/deleteUser" element={<DeleteUser />} />
        <Route path="/viewComplaints" element={<ComplaintsPage />} />
        <Route path="/preferenceTag" element={<PreferenceTag />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/product" element={<Product />} />
        <Route path="/admin/addAdmin" element={<Admin />} />
        <Route
          path="/admin/EditActivityCategories"
          element={<ActivityCategories />}
        />
        <Route
          path="/admin/addTourismGovernor"
          element={<TourismGovernor1 />}
        />
        <Route path="login" element={<Login />} />
        <Route path="/signup" element={<SignupGeneral />} />
        <Route path="/signup/signupTourist" element={<TouristRegistration />} />
        <Route
          path="/signup/signupAdvertiser"
          element={<AdvertiserRegistration />}
        />
        <Route path="/signup/signupTourguide" element={<FormPage />} />
        <Route path="/signup/signupSeller" element={<FormPageSeller />} />
        <Route path="/tourist-page" element={<TouristPage />} />
        <Route path="/tourist-profile" element={<TouristProfile />} />
        <Route path="/TourismGovernorDashboard" element={<TourismGovernor />} />
        <Route path="/advertiserHomePage" element={<AdvertiserHomePage />} />
        <Route path="/advertiserProfile" element={<AdvertiserProfile />} />
        <Route
          path="/advertiserActivities"
          element={<AdvertiserActivities />}
        />
        <Route path="/add" element={<HistoricalPlaceForm />} />
        <Route path="/edit/:id" element={<HistoricalPlaceForm />} />
        <Route path="/view/:id" element={<HistoricalPlaceDetails />} />
        <Route path="/profileTemplate" element={<ProfileTemplate />} />
        <Route path="/tourguideHomePage" element={<TourGuideHomePage />} />
        <Route path="/itinerary" element={<Itinerary />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products-purchased" element={<PurchasedProductsPage />} />
        </Routes>
    </BrowserRouter>
  </StrictMode>
);
