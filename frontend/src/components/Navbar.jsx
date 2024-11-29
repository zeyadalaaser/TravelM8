import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ShoppingCart } from 'lucide-react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Cart from "../pages/tourist/components/products/cart.jsx";
import LoginPage from "../pages/signIn/signin";
import SignupDialog from "../pages/SignUp/signup";
import NotificationBadge from "@/components/notificationBadge.jsx";
import NotificationBadgeDark from "@/components/notificationBadgeDark.jsx";
import LogoutAlertDialog from "@/hooks/logoutAlert";
import useRouter from "@/hooks/useRouter";

const pages = [
  { label: "Activities", value: "activities" },
  { label: "Itineraries", value: "itineraries" },
  { label: "Historical Places", value: "museums" },
  { label: "Products", value: "products" },
  { label: "Flights", value: "flights" },
  { label: "Hotels", value: "hotels" },
];

export default function Navbar({ profilePageString, children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { location } = useRouter();
  const currentPage = location.pathname + location.search;
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userName, setUserName] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAlertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id);
      if (existingItem) {
        return prevCart.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId));
  };

  const updateCartItemQuantity = (productId, newQuantity) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item._id === productId ? { ...item, quantity: Math.max(0, newQuantity) } : item
      ).filter(item => item.quantity > 0)
    );
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken && decodedToken.userId) {
        setUserName(decodedToken.username);
        setIsLoggedIn(true);
      }
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const decodeToken = (token) => {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      return decodedPayload;
    } catch (e) {
      console.error('Failed to decode token:', e);
      return null;
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    setAlertOpen(true);
  };

  const openSignup = () => {
    setIsSignupOpen(true);
    setIsLoginOpen(false);
  };

  const openLogin = () => {
    setIsLoginOpen(true);
    setIsSignupOpen(false);
  };

  const handleCheckout = () => {
    navigate('/checkout', { state: { cart, currency: 'USD' } });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 transition-all duration-300 ${
          currentPage === "/" ? "bg-transparent" : "bg-white text-black shadow-md"
        } ${isScrolled && currentPage === "/" ? "bg-gray-800/50 backdrop-blur-md" : "bg-gray-800"}`}
        style={{ height: "56px" }}
      >
        <div
          className={`text-2xl font-semibold ${
            currentPage === "/" ? "text-white" : "text-black"
          }`}
        >
          TRAVELM8
        </div>

        <div className="hidden md:flex items-center justify-start ml-20 space-x-1">
          <button
            key="/"
            className={`${
              currentPage === "/" ? 
              "text-white hover:text-white/70 py-2 px-4" 
              : "text-black hover:text-black/70 py-2 px-4"
            }`}
            onClick={() => navigate(`/`)}
          >
            Home
          </button>
          {pages.map((page) => (
            <button
              key={page.value}
              className={`${
                currentPage === "/" 
                  ? "text-white hover:text-white/70" 
                  : "text-black hover:text-black/70"
              } ${
                currentPage === `/tourist-page?type=${page.value}` 
                  ? "rounded-full py-2 px-4 border-[1px]" 
                  : "rounded-full py-2 px-4 border-[1px] border-transparent bg-transparent"
              }`}
              onClick={() => navigate(`/tourist-page?type=${page.value}`)}
            >
              {page.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              {currentPage === "/" ? <NotificationBadge /> : <NotificationBadgeDark />}
              <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className={currentPage === "/" ? "text-white" : "text-black"}
                  >
                    <div className="relative">
                      <ShoppingCart className="h-5 w-5" />
                      {totalItems > 0 && (
                        <Badge 
                          variant="secondary" 
                          className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-2"
                        >
                          {totalItems}
                        </Badge>
                      )}
                    </div>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Your Cart</SheetTitle>
                    <SheetDescription>Review your items before checkout</SheetDescription>
                  </SheetHeader>
                  <Cart
                    cart={cart}
                    removeFromCart={removeFromCart}
                    updateCartItemQuantity={updateCartItemQuantity}
                    currency="USD"
                  />
                  {cart.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total:</span>
                        <span className="font-bold">USD {totalPrice.toFixed(2)}</span>
                      </div>
                      <Button className="w-full mt-4" onClick={handleCheckout}>
                        Proceed to Checkout
                      </Button>
                    </>
                  )}
                </SheetContent>
              </Sheet>
              <button
                onClick={handleClick}
                className={`${
                  currentPage === "/" ? 
                  "text-white hover:text-white/80 border border-white rounded-full px-4 py-1 flex items-center space-x-2" 
                  :"text-black hover:text-black/80 border border-black rounded-full px-4 py-1 flex items-center space-x-2"
                }`}
              >
                <span>Hello, {userName}</span>
                <ChevronDown className={`h-4 w-4 ${currentPage === "/" ? "text-white" : "text-gray-500"}`} />
              </button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
                PaperProps={{
                  sx: {
                    width: "200px",
                  },
                }}
              >
                <MenuItem onClick={() => navigate("/tourist-profile")}>My profile</MenuItem>
                <MenuItem onClick={handleClose}>My bookings</MenuItem>
                <MenuItem onClick={() => {
                  handleClose();
                  navigate("/wallet");
                }}>Wallet</MenuItem>
                <MenuItem onClick={handleClose}>Settings</MenuItem>
                <Separator />
                <MenuItem onClick={handleLogoutClick}>Sign out</MenuItem>
              </Menu>
              <LogoutAlertDialog
                isOpen={isAlertOpen}
                onClose={() => setAlertOpen(false)}
              />
            </>
          ) : (
            <>
              <LoginPage
                isOpen={isLoginOpen}
                onOpenChange={setIsLoginOpen}
                onSignupClick={openSignup}
              >
                <Button
                  variant="outline"
                  className={`bg-transparent rounded-full px-8 py-2 ${
                    currentPage === "/" ? "text-white hover:bg-white/10 hover:text-white" : "text-black"
                  } `}
                >
                  Login
                </Button>
              </LoginPage>
              <SignupDialog
                isOpen={isSignupOpen}
                onOpenChange={setIsSignupOpen}
                onLoginClick={openLogin}
              >
                <button
                  className={`font-medium rounded-full px-8 py-2 ${
                    currentPage === "/" ? " bg-white text-black hover:bg-white/90" : "rounded-full px-8 bg-gray-800 hover:bg-gray-700 text-white "
                  } `}
                >
                  Register
                </button>
              </SignupDialog>
            </>
          )}
        </div>
      </nav>
      {React.Children.map(children, child =>
        React.cloneElement(child, { addToCart, cart })
      )}
    </>
  );
}

