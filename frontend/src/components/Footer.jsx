import React from 'react';
import {Facebook, Instagram, Youtube } from "lucide-react"; // Adjust this import if necessary
import { Link } from 'react-router-dom';
import { Twitter,  Mail, MapPin, Phone } from 'lucide-react'
import { useNavigate } from "react-router-dom";
import useRouter from "@/hooks/useRouter";


export default function Footer() {
  const { location } = useRouter();
  const searchParams = new URLSearchParams(location.search);
  const currency = searchParams.get("currency") ??"USD";
  return (
    <footer className="bg-gray-800 text-gray-300 py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
          <h3 className="font-bold text-lg mb-4">About Us</h3>
            <p className="text-md">
              We are a passionate travel website dedicated to helping adventurers explore the world's most beautiful destinations. From exotic getaways to local hidden gems, we're here to inspire your next journey.
            </p>
          </div>

          {/* Support Section */}
          <div>
            <h2 className="text-white text-xl font-semibold mb-4">Explore</h2>
            <ul className="space-y-2">
              <li><Link to={`/tourist-page?type=activities&currency=${currency}`} className="hover:text-white transition-colors">activities</Link></li>
              <li><Link to={`/tourist-page?type=itineraries&currency=${currency}`} className="hover:text-white transition-colors">itineraries</Link></li>
              <li><Link to={`/tourist-page?type=hotels&currency=${currency}`} className="hover:text-white transition-colors">hotels</Link></li>
              <li><Link to={`/tourist-page?type=flights&currency=${currency}`} className="hover:text-white transition-colors">flights</Link></li>
              <li><Link to={`/tourist-page?type=activities&currency=${currency}`} className="hover:text-white transition-colors">transportation</Link></li>
              <li><Link to={`/tourist-page?type=products&currency=${currency}`} className="hover:text-white transition-colors">shop</Link></li>
            </ul>
          </div>

          {/* FAQ Section */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <address className="not-italic space-y-8">
              <p className="flex items-center">
                <MapPin size={18} className="mr-2" />
                123 Traveler's Way, Adventure City
              </p>
              <p className="flex items-center">
                <Mail size={18} className="mr-2" />
                <a href="mailto:info@travelwebsite.com" className="hover:text-blue-600 transition-colors">info@travelwebsite.com</a>
              </p>
              <p className="flex items-center">
                <Phone size={18} className="mr-2" />
                (123) 456-7890
              </p>
            </address>
          </div>

          {/* Newsletter Section */}
          <div>
            <h2 className="text-white text-xl font-semibold mb-4">Newsletter</h2>
            <p className="mb-4">Don't miss out on the exciting world of travel – subscribe now and embark on a journey of discovery with us.</p>
            
            <form className="flex gap-2 mb-6">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-full bg-[#C4C4C4] border border-gray-700 focus:outline-none focus:border-gray-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-[#C4C4C4] text-white rounded-full hover:bg-gray-600 transition-colors"
              >
                Submit
              </button>
            </form>

            {/* Social Media Icons */}
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Facebook">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="YouTube">
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p>©2023 TravelM8, All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

