import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import TouristPage from "@/pages/tourist/tourist-page.jsx";
import Login from "@/pages/signIn/signin.jsx";
import SignupGeneral from "@/pages/SignUp/SignupGeneral.jsx";
import TouristRegistration from "@/pages/SignUp/signupTourist.jsx";
import FormPage from "@/pages/SignUp/signupTourguide.jsx";
import FormPageSeller from "@/pages/SignUp/signupSeller.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BrowserRouter as Router } from 'react-router-dom';
import "./index.css";
import TourismGovernor from "@/pages/TourismGovernor/dashboard.jsx";
import ActivityCategories from "@/pages/admin/services/ActivityCategories.jsx"; // Ensure this path is correct
import Admin from "@/pages/admin/services/Admin"; // Import the Admin component
import TourismGovernor1 from "@/pages/admin/services/TourismGovernor.jsx";
import DeleteUser from "./pages/admin/deleteUser-page.jsx";
import PreferenceTag from "./pages/admin/preferenceTag-page.jsx";
import AdminDashboard from "./pages/admin/dashboard.jsx";
import AdvertiserProfile from "./pages/Advertiser/advertiserProfile";
import Product from "./pages/admin/product.jsx";
import TourGuideProfile from "./pages/TourGuide/TourguideProfile.jsx";
import TouristProfile from "./pages/tourist/components/touristProfile.jsx";
import AdvertiserRegistration from "@/pages/SignUp/signupAdvertiser.jsx";
import SellerProfile from "@/pages/seller/SellerProfile.jsx";
import SellerProducts from "@/pages/seller/SellerProducts.jsx";
import ComplaintsPage from "@/pages/admin/complaints.jsx";
import ForgotPassword from "./pages/signIn/ForgetPassword.jsx";
import ResetPassword from "./pages/signIn/otpPage.jsx";
import Wallet from "./pages/tourist/components/wallet.jsx";
import Order from "./pages/tourist/components/order.jsx";
import AdminPromoCode from "./pages/admin/AdminPromoCode.jsx";
import { WalkthroughProvider } from './contexts/WalkthroughContext';

//import { ProductsPage } from "./pages/tourist/components/products/products-page.jsx";
//import PurchasedProductsPage from "@/pages/tourist/components/products/PurchasedProductsPage.jsx";
import AdminItinerariesPage from "./pages/admin/AdminItineraryPage.jsx";
import TourGuideDashboard from "./pages/TourGuide/tourguideDashboardDemo.jsx";
import ItineraryForm from "./pages/TourGuide/ItineraryForm.jsx";
import ActivityForm from "./pages/Advertiser/ActivityForm.jsx";
import AdvertiserDashboard from "./pages/Advertiser/advertiserDashboard.jsx";
import { ProductsPage } from "./pages/tourist/components/products/products-page.jsx";
import PurchasedProductsPage from "@/pages/tourist/components/products/PurchasedProductsPage.jsx";
import PendingUserDocuments from "./pages/admin/PendingUsersDocuments.jsx";
import Sellerdashboard from "@/pages/seller/Sellerdashboard.jsx";
import AccountDelete from "./pages/admin/accountDelete.jsx";
//import PreferencesPage from "./pages/SignUp/PreferencesPage.jsx";
import SignupsRoles from "./pages/SignUp/signupRoles.jsx";
import { Toaster } from "@/components/ui/sonner"
import LoadingPage from "./components/loading.jsx";
import CheckoutPage from "./pages/tourist/components/products/checkout-page";
import NotificationsPage from "./pages/TourGuide/NotificationsPage.jsx";
import LoginPage from "./pages/signIn/signin.jsx";
import ManageActivities from "./pages/admin/ManageActivities.jsx";
import PastActivities from "./pages/tourist/components/activities/PastActivitiesPage.jsx";
import BookmarksPage from './pages/tourist/components/activities/activities.jsx';
import Checkout from "./pages/tourist/components/products/checkout.jsx";
import PreferencesPage from './pages/tourist/components/Preferences.jsx';
import "@/lib/formatter.js";
import { CurrencyProvider } from "./hooks/currency-provider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <WalkthroughProvider>
      <CurrencyProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/checkout" element={<Checkout />} />
            {/* <Route path="/admin" element={<AdminPage/>} /> */}
            <Route path="/loading" element={<LoadingPage />} />
            <Route path="/Sellerdashboard" element={<Sellerdashboard />} />
            <Route path="/SellerProducts" element={<SellerProducts />} />
            <Route path="/SellerProfile" element={<SellerProfile />} />
            <Route path="/tourist" element={<TouristPage />} />
            <Route path="/deleteUser" element={<DeleteUser />} />
            <Route path="/viewComplaints" element={<ComplaintsPage />} />
            <Route path="/preferenceTag" element={<PreferenceTag />} />
            <Route path="/Admindashboard" element={<AdminDashboard />} />
            <Route path="/AdminPromoCode" element={<AdminPromoCode />} />
            <Route path="/product" element={<Product />} />
            <Route path="/admin/addAdmin" element={<Admin />} />
            <Route path="/deleteAccount" element={<AccountDelete />} />
            <Route
              path="/admin/EditActivityCategories"
              element={<ActivityCategories />}
            />
            <Route
              path="/admin/addTourismGovernor"
              element={<TourismGovernor1 />}
            />
            <Route path="login" element={<Login />} />
            <Route path="/signup" element={<SignupsRoles />} />
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
            <Route path="/advertiserProfile" element={<AdvertiserProfile />} />
            <Route path="/activityForm" element={<ActivityForm />} />
            <Route path="/advertiserDashboard" element={<AdvertiserDashboard />} />
            <Route path="/tourGuideProfile" element={<TourGuideProfile />} />
            <Route path="/tourGuideDashboard" element={<TourGuideDashboard />} />
            <Route path="/itineraryForm" element={<ItineraryForm />} />
            <Route path="/admin/itineraries" element={<AdminItinerariesPage />} />
            <Route path="/admin/pending-users" element={<PendingUserDocuments />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/Pastactivities" element={<PastActivities />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/siginIn" element={<LoginPage />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/order" element={<Order />} />
            <Route path="/admin/manage-activities" element={<ManageActivities />} />
            <Route path="/bookmarks" element={<BookmarksPage ></BookmarksPage>} />
            <Route path="/preferences" element={<PreferencesPage />} />
          </Routes>
        </BrowserRouter>
        <Toaster closeButton richColors toastOptions={{
          classNames: {
            toast: 'w-auto right-0',
          },
        }} />
      </CurrencyProvider>
    </WalkthroughProvider>
  </StrictMode>
);
