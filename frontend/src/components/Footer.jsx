import React from 'react';
import { Facebook, Instagram, Youtube, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import useRouter from "@/hooks/useRouter";

export default function Footer() {
  const { location } = useRouter();
  const searchParams = new URLSearchParams(location.search);
  const currency = searchParams.get("currency") ?? "USD";

  return (
    <footer className="bg-gray-800 text-gray-300 py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="font-bold text-lg mb-4">About Us</h3>
            <p className="text-sm">
              We are a passionate travel website dedicated to helping adventurers explore the world's most beautiful destinations. From exotic getaways to local hidden gems, we're here to inspire your next journey.
            </p>
          </div>

          {/* Support Section */}
          <div>
            <h2 className="text-white text-lg font-semibold mb-4">Explore</h2>
            <ul className="space-y-2 text-sm">
              <li><Link to={`/tourist-page?type=activities&currency=${currency}`} className="hover:text-white transition-colors">Activities</Link></li>
              <li><Link to={`/tourist-page?type=itineraries&currency=${currency}`} className="hover:text-white transition-colors">Itineraries</Link></li>
              <li><Link to={`/tourist-page?type=hotels&currency=${currency}`} className="hover:text-white transition-colors">Hotels</Link></li>
              <li><Link to={`/tourist-page?type=flights&currency=${currency}`} className="hover:text-white transition-colors">Flights</Link></li>
              <li><Link to={`/tourist-page?type=products&currency=${currency}`} className="hover:text-white transition-colors">Shop</Link></li>
            </ul>
          </div>

          {/* Contact Us Section */}
          <div>
            <h3 className="font-bold text-lg mr-32 mb-4">Contact Us</h3>
            <address className="not-italic space-y-2 text-sm">
              <p className="flex items-center">
                <MapPin size={16} className="mr-2" />
                5th settlement, New Cairo
              </p>
              <p className="flex items-center">
                <Mail size={16} className="mr-2" />
                <a href="mailto:info@travelM8.com" className="hover:text-blue-400 transition-colors">info@travelm8.com</a>
              </p>
              <p className="flex items-center">
                <Phone size={16} className="mr-2" />
                (123) 456-7890
              </p>
            </address>
          </div>

          {/* Newsletter Section */}
          <div>
            <h2 className="text-white text-lg font-semibold mb-4">Newsletter</h2>
            <p className="mb-4 text-sm">Don't miss out on the exciting world of travel – subscribe now and embark on a journey of discovery with us.</p>
            
            <form className="flex gap-2 mb-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-1 text-sm rounded-full bg-gray-700 border border-gray-600 focus:outline-none focus:border-gray-500 text-white"
              />
              <button
                type="submit"
                className="px-4 py-1 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                Submit
              </button>
            </form>

            {/* Social Media Icons */}
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 border-t border-gray-700 text-center text-sm">
          <p>©2023 TravelM8, All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}

