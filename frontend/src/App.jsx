import React, { useState, useEffect } from 'react';
import { useDebouncedCallback } from "use-debounce";
import { Button } from "@/components/ui/button";
import useRouter from "@/hooks/useRouter";
import { Star, Facebook, Instagram, Youtube } from "lucide-react";
import { RefreshCcw, Ticket, Zap, Map } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { SeeAllButton } from "@/components/ui/see-all-button"
import { Arrow } from "@/components/ui/arrow"
import Logout from "@/hooks/logOut.jsx";
import { Link } from 'react-router-dom';
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx"
import BookingComponent from "@/components/bookingCard/bookingCard.jsx";
import { motion, AnimatePresence } from 'framer-motion'
import * as services from "@/pages/tourist/api/apiService.js";
import { jwtDecode } from 'jwt-decode';
import axios from "axios";
import { CircularProgress } from "@mui/material"
const images = [
  "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=2020&ixlib=rb-4.0.3",
  "https://wallpapercave.com/wp/wp2481186.jpg",
  "https://images.unsplash.com/photo-1541628951107-a9af5346a3e4?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3", 
  "https://wallpaper.forfun.com/fetch/d5/d5c3e417f3b7121700fcb33d337c44ba.jpeg"
]

export default function HeroSection() {

  const { location } = useRouter();
  const navigate = useNavigate();
  const [museums, setMuseums] = useState([]);
  const [currency, setCurrency] = useState("USD");
  const [exchangeRates, setExchangeRates] = useState({});
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [itineraries, setItineraries] = useState([]);
  const [products, setProducts] = useState([]);
  const [activities, setActivities] = useState([]);
  const isAdmin = false;
  const topFourMuseums = museums?.slice(0, 4);
  const topItineraries = itineraries?.slice(0, 3);
  const topProducts = products?.slice(0, 3);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");

  // useEffect(() => {

  //   const decodedToken = jwtDecode(token);
  //   const currentTime = Math.floor(Date.now() / 1000);
  
  //   if (decodedToken.exp < currentTime) {
  //     navigate("/");
  //   } else {
  //     setTimeout(() => {
  //       navigate("/");
  //     }, (decodedToken.exp - currentTime) * 1000); // Time until expiration
  //   }

  // }, [token]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(timer)
  }, [])
  useEffect(() => {
    window.scrollTo(0, 0);
  },[]);

  // Fetch latest exchange rates on mount
  useEffect(() => {
    async function fetchExchangeRates() {
      try {
        const response = await axios.get(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );
        setExchangeRates(response.data.rates);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    }
    fetchExchangeRates();
  }, []);

  const fetchMuseums = useDebouncedCallback(async () => {
      const queryParams = new URLSearchParams(location.search);
      queryParams.set("currency", currency);
      queryParams.set("exchangeRate", exchangeRates[currency] || 1);

      const fetchedMuseums = await services.getMuseums(`?${queryParams.toString()}`);
      setMuseums(fetchedMuseums);
  }, 200);

  useEffect(() => {
    fetchMuseums();
  }, [location.search, currency]);

  const fetchItineraries = useDebouncedCallback(async () => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("isAdmin", isAdmin);
    queryParams.set("currency", currency);

    try {
      let fetchedItineraries = (await services.getItineraries(
        `?${queryParams.toString()}`
      )).filter(i => i.isBookingOpen);

      if (!isAdmin) {
        fetchedItineraries = fetchedItineraries.filter(
          (itinerary) => !itinerary.flagged
        );
      }
      setItineraries(fetchedItineraries);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
    }
  }, 200);

  useEffect(() => {
    fetchItineraries();
  }, [location.search, currency, priceRange]);
  
  const blogPosts = [
    {
      date: "Nov 14, 2022",
      title: "2023 Travel Trends – what you need to know",
      description: "2023 taught us valuable life lessons. Plans don't always work out, flexibility in life is key, a...",
      image: "https://i.pinimg.com/736x/f4/68/c1/f468c1d19eff59803b8a32def5baf45e.jpg",
      href: "#"
    },
    {
      date: "Nov 18, 2022",
      title: "Jeep Adventure is a new attraction for tourists visiting Garut",
      description: "Jeep Adventure is one of the tourist attractions that has been popular recently. The sensation...",
      image: "https://wallpapershome.com/images/pages/ico_h/26118.jpg",
      href: "#"
    }
  ]

  const fetchProducts = useDebouncedCallback(async () => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("currency", currency);

    try {
      const fetchedProducts = await services.getProducts(`?${queryParams.toString()}`);
      console.log("Fetched products:", fetchedProducts); // Log for debugging
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } 
  }, 200);


  useEffect(() => {
    fetchProducts();
  }, [location.search, currency]);


  const fetchActivities = useDebouncedCallback(async () => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("currency", currency);

    try {
      const fetchedActivities = await services.getActivities(`?${queryParams.toString()}`);
      console.log("Fetched activities:", fetchedActivities); // Log for debugging
      setActivities(fetchedActivities);
    } catch (error) {
      console.error("Error fetching products:", error);
    } 
  }, 200);


  useEffect(() => {
    fetchActivities();
  }, [location.search, currency]);

  function getUserFromToken(token) {
    if (!token) return {};
    const decoded = JSON.parse(atob(token.split(".")[1])); // Decode the token
    console.log("User ID:", decoded.userId);
    return { id: decoded.userId, role: decoded.role }; // Get the role and tourist ID from the token
  }

    useEffect(() => {
    const { role } = getUserFromToken(token);
    if (role === "Seller") {
      navigate("/Sellerdashboard"); // Redirect if the role is not 'tourist'
      return;
    }
    if (role === "Admin") {
      navigate("/Admindashboard"); // Redirect if the role is not 'tourist'
      return;
    }
    if (role === "TourismGovernor") {
      navigate("/TourismGovernorDashboard"); // Redirect if the role is not 'tourist'
      return;
    }
    if (role === "TourGuide") {
      navigate("/tourGuideDashboard"); // Redirect if the role is not 'tourist'
      return;
    }
    if (role === "Advertiser") {
      navigate("/advertiserDashboard"); // Redirect if the role is not 'tourist'
      return;
    }

  }, [navigate]);
  


  const steps = [
    {
      icon: <RefreshCcw className="w-6 h-6" />,
      title: "Find your destination",
      description: "Embark on an exciting journey by exploring our different itineraries and activities, where adventure and relaxation await.",
    },
    {
      icon: <Ticket className="w-6 h-6" />,
      title: "Book a ticket",
      description: "Ensure a smooth travel experience by booking tickets to your preferred destination via our booking platform",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Make payment",
      description: "We offer a variety of payment options to meet your preferences and ensure a hassle-free transaction process.",
    },
    {
      icon: <Map className="w-6 h-6" />,
      title: "Explore different destinations",
      description: "Get immersed in a captivating tapestry of sights, sounds and tastes, as you wind your way through the ancient streets",
    },
  ];

  return (


 <div className="bg-gray-50 min-h-screen">
      {isLoading ? (
      <div style={spinnerStyle}>
        <CircularProgress/>
      </div>
    ) : (
  <>
  <Navbar />
  <div className="relative min-h-screen overflow-x-hidden">
            {/* Background Image */}
            <AnimatePresence initial={false}>
              <motion.div
                key={currentImageIndex}
                className="absolute inset-0 bg-cover bg-center "
                style={{ backgroundImage: `url(${images[currentImageIndex]})`, height: "83vh", }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-20" />
              </motion.div>
            </AnimatePresence>


            {/* Hero Content */}
            <div className="relative z-10 flex flex-col min-h-screen">
              {/* Heading and Paragraph */}
              <div className="p-6 md:p-10 max-w-2xl mt-40">
                <h1 className="font-medium tracking-tight text-white sm:text-5xl">
                  Extraordinary natural and cultural charm
                </h1>
                <p className="mt-6 text-lg text-white/90">
                  Explore the world in an unforgettable adventure.
                </p>
              </div>
              {/* Booking Component */}
              <div className="mt-auto mb-10 flex flex-wrap items-center justify-center p-6 w-full">
                <div className="w-full max-w-6xl rounded-2xl p-6">
                  <BookingComponent />
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto p-6 ">
              <div className="mb-2 text-xl font-medium text-gray-500">Discover</div>
              <div className="flex justify-between items-start mb-8">
                <h2 className="text-5xl font-medium max-w-xl">Popular places </h2>
                <p className="text-gray-500 font-medium max-w-md text-sm">
                  Extraordinary natural and cultural beauty, enjoy the rich culture, and experience the friendliness of the local people.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {topFourMuseums.length > 0 && (
                  <>
                    {/* Top row - wider first image, smaller second image */}
                    <div className="col-span-2 relative h-96 rounded-2xl overflow-hidden">
                      <img
                        src={topFourMuseums[0].image} // First museum image
                        alt={topFourMuseums[0].name}
                        className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="font-medium">{topFourMuseums[0].name}</div>
                        <div className="text-sm text-white/80">{topFourMuseums[0].description}</div>
                      </div>
                    </div>

                    <div className="relative h-96 rounded-2xl overflow-hidden">
                      <img
                        src={topFourMuseums[1].image} // Second museum image
                        alt={topFourMuseums[1].name}
                        className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="font-medium">{topFourMuseums[1].name}</div>
                        <div className="text-sm text-white/80">{topFourMuseums[1].description}</div>
                      </div>
                    </div>

                    {/* Bottom row - smaller first image, wider second image */}
                    <div className="relative h-96 rounded-2xl overflow-hidden">
                      <img
                        src={topFourMuseums[2].image} // Third museum image
                        alt={topFourMuseums[2].name}
                        className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="font-medium">{topFourMuseums[2].name}</div>
                        <div className="text-sm text-white/80">{topFourMuseums[2].description}</div>
                      </div>
                    </div>

                    <div className="col-span-2 relative h-96 rounded-2xl overflow-hidden">
                      <img
                        src={topFourMuseums[3].image} // Fourth museum image
                        alt={topFourMuseums[3].image}
                        className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="font-medium">{topFourMuseums[3].name}</div>
                        <div className="text-sm text-white/80">{topFourMuseums[3].description}</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-24">
              <div className="mb-4">
                {/* <p className="text-gray-500 text-xl mb-4">Online store</p> */}
                <div className="flex justify-between items-start mt-4">
                  <h2 className="text-5xl font-medium max-w-xl mt-4">Explore our itineraries</h2>
                  <p className="text-gray-500 max-w-md mt-6">
                  Our tourist destinations offer an unrivaled blend of natural beauty and cultural richness.
                  </p>
                </div>
                <div className="mt-2 flex justify-start">
                      <SeeAllButton redirectTo="tourist-page?type=itineraries"
                       currency={currency} className="mb-2" > See all itineraries</SeeAllButton>
                  </div>
              </div>
              <div className="relative ">
              <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
              <CarouselContent>
                {itineraries.map((tour, index) => (
                  <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/3 ">
                  <div key={index} className="relative rounded-3xl overflow-hidden group cursor-pointer">
                    <div className="aspect-[3/4]">
                      <img
                        src={tour?.images?.[0]}
                        alt={tour.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                    </div>

                    {/* Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

                    {/* Top badges */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                      <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm">
                        {tour.tourLanguage}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm flex items-center gap-1">
                        <Star className="w-4 h-4 fill-current" /> {tour.averageRating?.toFixed(2)}
                      </span>
                    </div>

                    {/* Bottom content */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="text-white/80 text-sm mb-2">
                        {tour.timeline.startTime} - {tour.timeline.endTime}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white text-xl font-medium">{tour.name}</span>
                      </div>
                      <span className="text-white text-xl">
                        <span>{currency} </span>{tour.price}
                      </span>
                    </div>
                  </div>
                  </CarouselItem>
                ))}
                </CarouselContent>
                  <CarouselPrevious className="absolute top-1/2 -left-12 -translate-y-1/2 z-10" />
                  <CarouselNext className="absolute top-1/2 -right-12 -translate-y-1/2 z-10" />
                </Carousel>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-24">
              <div className="mb-4">
                {/* <p className="text-gray-500 text-xl mb-4">Online store</p> */}
                <div className="flex justify-between items-start">
                  <h2 className="text-5xl font-medium max-w-xl">Explore different activities</h2>
                  <p className="text-gray-500 max-w-md mt-2">
                  Discover exciting activities tailored to your interests, from thrilling adventures to relaxing experiences.
                  </p>
                </div>
                <div className="mt-2 flex justify-start">
                       <SeeAllButton redirectTo="tourist-page?type=activities"
                       currency={currency} className="mb-2" > See all activities</SeeAllButton>
                  </div>
              </div>

              <div className="relative">
              <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
                    <CarouselContent>
                      {activities.map((activity, index) => (
                        <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/4 ">
                          <div className="relative rounded-3xl overflow-hidden group cursor-pointer">
                            <div className="aspect-[1/1]">
                              <img
                                src={activity?.image}
                                alt={activity.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
                            <div className="absolute bottom-4 left-4 right-4">
                              <div className="flex justify-between items-center">
                                <span className="text-white text-xl font-medium">{activity.title}</span>
                              </div>
                              <span className="text-white text-xl">
                                <span>{currency} </span>{activity.price}
                              </span>
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>

                    {/* Navigation Buttons */}
                    <CarouselPrevious className="absolute top-1/2 -left-12 -translate-y-1/2 z-10" />
                    <CarouselNext className="absolute top-1/2 -right-12 -translate-y-1/2 z-10" />
                  </Carousel>
                </div>
              </div>
            
            <div className="max-w-7xl mx-auto px-6 mt-24">
              <div className="mb-4">
                {/* <p className="text-gray-500 text-xl mb-4">Online store</p> */}
                <div className="flex justify-between items-start">
                  <h2 className="text-5xl font-medium max-w-xl">Explore our Shop</h2>
                  <p className="text-gray-500 max-w-md mt-2">
                    All you need in one place! From travel essentials to unique finds, shop with ease and enjoy great deals and quick delivery.
                  </p>
                </div>
                <div className="mt-2 flex justify-start">
                       <SeeAllButton redirectTo="tourist-page?type=products"
                       currency={currency} className="mb-2" > See all products</SeeAllButton>
                  </div>
              </div>

              <div className="relative">
              <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
                    <CarouselContent>
                      {products.map((product, index) => (
                        <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/3 ">
                          <div className="relative rounded-3xl overflow-hidden group cursor-pointer">
                            <div className="aspect-[1/1]">
                              <img
                                src={product?.image}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                            </div>

                            {/* Overlays */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

                            {/* Bottom content */}
                            <div className="absolute bottom-4 left-4 right-4">
                              <div className="flex justify-between items-center">
                                <span className="text-white text-xl font-medium">{product.name}</span>
                              </div>
                              <span className="text-white text-xl">
                                <span>{currency} </span>{product.price}
                              </span>
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>

                    {/* Navigation Buttons */}
                    <CarouselPrevious className="absolute top-1/2 -left-12 -translate-y-1/2 z-10" />
                    <CarouselNext className="absolute top-1/2 -right-12 -translate-y-1/2 z-10" />
                  </Carousel>
                </div>
              </div>

            <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto p-6 mt-32">
              {/* Left side - Image and Search */}
              <div className="lg:w-2/5">
                <div className="relative rounded-3xl overflow-hidden">
                  <img
                    src="https://i.pinimg.com/736x/93/c5/dd/93c5dded5d825784eefa73a068c7fe16.jpg"
                    alt="Person in yellow raincoat on beach"
                    className="w-full h-[600px] object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Search filters */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-white mb-4 max-w-md">
                      Embark on a journey to find your dream destination, where adventure and relaxation await, creating unforgettable memories along the way
                    </p>

                  </div>
                </div>
              </div>

              {/* Right side - How it works */}
              <div className="lg:w-1/2 mt-8">
                <div className="space-y-8">
                  <div>
                    <p className="text-gray-600 mb-2">How it works</p>
                    <h2 className="text-4xl font-medium font-bold">One click for you</h2>
                  </div>

                  <div className="space-y-8">
                    {steps.map((step, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                          {step.icon}
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold">{step.title}</h4>
                          <p className="text-gray-600">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div><section className="container mx-auto px-4 py-12">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-medium font-bold tracking-tight">Our travel memories</h1>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {blogPosts.map((post, index) => (
                  <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg">
                    <Link href={post.href}>
                      <div className="relative h-[300px] overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform hover:scale-105 duration-300" />
                      </div>
                      <div className="p-6">
                        <p className="text-gray-500 mb-4 font-medium">{post.date}</p>
                        <h3 className="text-2xl font-bold mb-4 leading-tight font-medium">{post.title}</h3>
                        <p className="text-gray-600 font-medium">{post.description}</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
            <Footer /></>
  )}
    </div>

    
  );
}

const spinnerStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',  // Optional, for overlay effect
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
};