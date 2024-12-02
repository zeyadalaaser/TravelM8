"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MinusIcon, PlusIcon, ShoppingBagIcon, MenuIcon, XIcon } from 'lucide-react'
import { useState, useEffect } from "react"
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar.jsx";
import { CircularProgress } from "@mui/material"
import * as services from "@/pages/tourist/api/apiService.js";
import { useLocation } from "react-router-dom";
import axios from "axios"
import { NumberStepper } from "@/components/ui/number-stepper"
// Mock addresses data
// const addresses = [
//   {
//     id: 1,
//     name: "Sara Hussein",
//     address: "FLAT 3102 PIONEER POINT NORTH TOWER 3, WINSTON WAY, ILFORD, IG1 2ZD",
//     country: "United Kingdom"
//   },
//   {
//     id: 2,
//     name: "Mahmoud Awad",
//     address: "Prince Sultan Road, 205 طريق جدة للوحدات السكنية, منطقة",
//     city: "Jeddah",
//     region: "Makkah",
//     country: "Saudi Arabia"
//   },
//   {
//     id: 3,
//     name: "Mohamed Taha",
//     address: "Almukall Street, 12485, North Building, apartment number: 19, Second Floor",
//     city: "Riyadh",
//     region: "Riyadh",
//     country: "Saudi Arabia"
//   }
// ]

export default function CheckoutPage() {
  const location = useLocation();
  const { cart} = location.state || {};
  const searchParams = new URLSearchParams(location.search);
  const currency = searchParams.get('currency');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddAddressDialog, setShowAddAddressDialog] = useState(false)
  const [showDeliveryForm, setShowDeliveryForm] = useState(true)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [showPromotionCode, setShowPromotionCode] = useState(false)
  const token = localStorage.getItem("token");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [exchangeRates, setExchangeRates] = useState({});
  const [cartItems, setCartItems] = useState(cart || []);
  useEffect(() => {

    if (cart) {
      setCartItems(cart);
    }
  }, [cart]);

  const updateItemQuantity = async (item, newQuantity) => {
    console.log(item);
    try {
        await axios.put(`http://localhost:5001/api/tourists/cart/${item.productId._id}`, { quantity: newQuantity }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      setCartItems(prevCart => 
        prevCart.map(sth => 
          sth._id === item._id 
            ? { ...sth, quantity: newQuantity }
            : sth
        )
      );
      if (newQuantity===0) {
        setCartItems(prevCart => prevCart.filter(sth => sth._id !== item._id));
      }
    } catch (error) {
      console.error('Failed to update item quantity:', error);
    }
  };

  useEffect(() => {
    async function fetchExchangeRates() {
      try {
        const response = await axios.get("https://api.exchangerate-api.com/v4/latest/USD");
        setExchangeRates(response.data.rates);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    }
    console.log(exchangeRates);
    fetchExchangeRates();
  }, []);
  const totalPrice = Array.isArray(cart) ? cart.reduce((sum, item) => sum + ((item.price || 0)), 0) : 0;

  

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false); 
    }, 2000); 
  }, []);

  const fetchMyAddresses = async () => {
    try {
        const response = await services.getMyAddresses(token);
        setAddresses(response.addresses);
    }
    catch(error) {
        console.error("Message:", error.message);
    }

  }

  useEffect (() => {
    fetchMyAddresses();
    console.log(cart);
}
, [cart])


  return (
    <div className="min-h-screen bg-[#FAF9F6]">
       {isLoading ? (
        <div style={spinnerStyle}>
          <CircularProgress/>
        </div>
      ) : (
        <>
            <header style={navbarStyle}>
            <h1 style={navbarTitleStyle}>
                Checkout
                <a href="/" style={cancelButtonStyle}>
                (cancel)
                </a>
            </h1>
            </header>
        <main className="mx-auto grid  max-w-7xl gap-8 p-8 md:grid-cols-[2fr_1fr]">

                      <div className="space-y-8">
                          {/* Shipping Address Section */}
                          <div className="border-b pb-6">
                              <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-4">
                                      <span className="text-2xl font-semibold">1</span>
                                      <h2 className="text-xl font-semibold">Shipping address</h2>
                                  </div>
                              </div>
                              <div className="bg-white rounded-lg border p-6 relative">
                                  <RadioGroup
                                      value={selectedAddress}
                                      onValueChange={(value) => setSelectedAddress(value)}
                                      className="space-y-4"
                                  >
                                      {addresses.map((addr) => (
                                          <div key={addr._id} className="flex items-start space-x-3 rounded-lg border p-4">
                                              <RadioGroupItem value={addr._id} id={addr._id} className="mt-1" />
                                              <div className="flex-1">
                                                  <Label htmlFor={addr._id} className="font-medium">
                                                      {addr.fullName}
                                                  </Label>
                                                  <p className="text-sm text-gray-600 mt-1">{addr.streetName}, {addr.postalCode}, Building {addr.buildingNumber}</p>
                                                  {addr.city && (
                                                      <p className="text-sm text-gray-600">
                                                          {addr.city}, {addr.country}
                                                      </p>
                                                  )}
                                                  {/* <div className="flex gap-4 mt-2">
                                                      <button className="text-blue-600 text-sm hover:underline">Edit</button>
                                                      <button className="text-blue-600 text-sm hover:underline">
                                                          Add delivery instructions
                                                      </button>
                                                  </div> */}
                                              </div>
                                          </div>
                                      ))}
                                  </RadioGroup>
                                  <Dialog open={showAddAddressDialog} onOpenChange={setShowAddAddressDialog}>
                                      <DialogTrigger>
                                          <button className="text-blue-600 flex items-center gap-2 mt-4">
                                              <span className="text-xl">+</span> Add a new address </button>
                                      </DialogTrigger>
                                      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                                          <DialogHeader>
                                              <DialogTitle>Enter a new shipping address</DialogTitle>
                                          </DialogHeader>
                                          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                              <div className="space-y-2">
                                                  <Label htmlFor="country">Country/region</Label>
                                                  <Select defaultValue="sa">
                                                      <SelectTrigger>
                                                          <SelectValue placeholder="Select country" />
                                                      </SelectTrigger>
                                                      <SelectContent>
                                                          <SelectItem value="sa">Saudi Arabia</SelectItem>
                                                          <SelectItem value="ae">United Arab Emirates</SelectItem>
                                                          <SelectItem value="kw">Kuwait</SelectItem>
                                                      </SelectContent>
                                                  </Select>
                                              </div>

                                              <div className="space-y-2">
                                                  <Label htmlFor="fullName">Full name (First and Last name)</Label>
                                                  <Input id="fullName" placeholder="Enter your full name" />
                                              </div>

                                              <div className="space-y-2">
                                                  <Label htmlFor="mobile">Mobile number</Label>
                                                  <div className="flex gap-2">
                                                      <Select defaultValue="+966">
                                                          <SelectTrigger className="w-[120px]">
                                                              <SelectValue placeholder="Code" />
                                                          </SelectTrigger>
                                                          <SelectContent>
                                                              <SelectItem value="+966">🇸🇦 +966</SelectItem>
                                                              <SelectItem value="+971">🇦🇪 +971</SelectItem>
                                                              <SelectItem value="+965">🇰🇼 +965</SelectItem>
                                                          </SelectContent>
                                                      </Select>
                                                      <Input className="flex-1" placeholder="e.g. 05XXXXXXXX" />
                                                  </div>
                                                  <p className="text-sm text-gray-500">May be used to assist delivery</p>
                                              </div>

                                              <div className="space-y-2">
                                                  <Label htmlFor="street">Street name</Label>
                                                  <Input id="street" placeholder="e.g. Al Oruba Street" />
                                              </div>

                                              <div className="space-y-2">
                                                  <Label htmlFor="building">Building name/no</Label>
                                                  <Input id="building" placeholder="e.g. Princess Tower" />
                                              </div>

                                              <div className="space-y-2">
                                                  <Label htmlFor="city">City</Label>
                                                  <Input id="city" placeholder="E.g. Riyadh, Jeddah, Makkah, Al Ahsa" />
                                              </div>

                                              <div className="flex justify-end gap-4 pt-4">
                                                  <Button variant="outline" onClick={() => setShowAddAddressDialog(false)}>
                                                      Cancel
                                                  </Button>
                                                  <Button
                                                      className="bg-green-800  hover:bg-green-900 text-white"
                                                      onClick={() => setShowAddAddressDialog(false)}
                                                  >
                                                      Add address
                                                  </Button>
                                              </div>
                                          </form>
                                      </DialogContent>
                                  </Dialog>
                              </div>
                          </div>

                          <div className="border-b pb-6">
                              <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-4">
                                      <span className="text-2xl font-semibold">2</span>
                                      <h2 className="text-xl font-semibold">Payment method</h2>
                                  </div>
                              </div>
                            <div className="bg-white rounded-lg border p-6 relative">
                              <RadioGroup
                                  value={paymentMethod}
                                  onValueChange={setPaymentMethod}
                                  className="space-y-4"
                              >
                                  <div className={`rounded-lg border p-4 ${paymentMethod === "card" ? 'bg-white' : 'rounded-lg border p-4'}`}>
                                      <div className="flex items-center  space-x-2">
                                          <RadioGroupItem value="card" id="card" />
                                          <Label htmlFor="card">Credit/Debit Card</Label>
                                      </div>
                                      {paymentMethod === "card" && <CreditCardForm />}
                                  </div>
                                  <div className="flex items-center space-x-2 rounded-lg border p-4">
                                      <RadioGroupItem value="cod" id="cod" />
                                      <Label htmlFor="cod">Cash on Delivery</Label>
                                  </div>
                                  <div className="flex items-center space-x-2 rounded-lg border p-4">
                                      <RadioGroupItem value="wallet" id="wallet" />
                                      <Label htmlFor="wallet">Wallet Balance</Label>
                                  </div>
                              </RadioGroup>
                              </div>
                          </div>
                          <div className="border-b pb-6">
                              <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-4">
                                      <span className="text-2xl font-semibold">3</span>
                                      <h2 className="text-xl font-semibold">Review your order</h2>
                                  </div>
                              </div>
                              <div className="bg-white rounded-lg border p-6 relative">
                              {cartItems.length > 0 ? (
                        <ul className="space-y-4">
                          {cartItems.map((item) => (
                            <><li key={item?._id} className="flex items-center justify-between space-x-4">
                                  {/* Left Section: Image and Name */}
                                  <div className="flex items-center space-x-4">
                                      <img
                                          src={item?.productId.image || "https://via.placeholder.com/100"}
                                          alt={item?.productId.name}
                                          className="w-16 h-16 object-cover rounded" />
                                      <div>
                                          <h4 className="font-medium mb-3 text-md">{item?.productId.name}</h4>
                                          <NumberStepper
                                              value={item?.quantity}
                                              onChange={(newQuantity) => {
                                                  updateItemQuantity(item, newQuantity)
                                              } }
                                              min={0}
                                              max={item?.productId.quantity}
                                              step={1} />
                                      </div>
                                  </div>

                                  {/* Right Section: Price */}
                                  <span className="font-medium mb-10 text-lg">
                                      {currency} {(item.productId.price * (exchangeRates[currency] || 1)).toFixed(2)}
                                  </span>
                              </li><Separator /></>
                          ))}
                          
                        </ul>
                      ) : (
                        <p>Your cart is empty.</p>
                      )}
                              </div>
                          </div>

                      </div>

                      {/* Order Summary Card */}
                      <div>
                          <Card className="min-h-[85vh] mt-12  flex flex-col p-2">
                              <CardHeader>
                                  <CardTitle>Order Summary</CardTitle>
                              </CardHeader>

                              <CardContent className="flex-1 overflow-y-auto">
                              {cart?.map((item) => (
                                <><div key={item._id} className="flex items-center justify-between p-4">
                                      <div className="flex-1">
                                          <h3 className="font-medium">{item.productId.name}</h3>
                                      </div>
                                      <p className="text-sm text-gray-500">{currency} {(item.productId.price * (exchangeRates[currency])).toFixed(2)}</p>
                                  </div><Separator /></>

                                ))}
                              </CardContent>

                              {/* Footer with Subtotal, Shipping, Total, and Confirm Order */}
                              <div className="mb-4 space-y-2 pt-4 px-4">
                                  <div className="flex justify-between">
                                      <span className="text-gray-500">Subtotal</span>
                                      <span>{currency} {(totalPrice* (exchangeRates[currency])).toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                      <span className="text-gray-500">Shipping</span>
                                      <span>{currency} 20.00</span>
                                  </div>
                                  <div className="flex justify-between font-medium">
                                      <span>Total ({currency})</span>
                                      <span>{currency} {((totalPrice +20)* (exchangeRates[currency])).toFixed(2)}</span>
                                  </div>
                                  <Button className="w-full bg-green-800 text-white hover:bg-green-900">
                                      Confirm Order
                                  </Button>
                              </div>
                          </Card>
                      </div>
                  </main></>
      )}
      </div>
  )
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

function CreditCardForm() {
    return (
      <div className="mt-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input id="expiryDate" placeholder="MM/YY" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvv">CVV</Label>
            <Input id="cvv" placeholder="123" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cardName">Name on Card</Label>
          <Input id="cardName" placeholder="John Doe" />
        </div>
      </div>

    )
    
  }
  const navbarStyle = {
    backgroundColor: "bg-[#FAF9F6]",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "60px",
    width: "100%",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    position: "relative",
  };

  const navbarTitleStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    margin: "0",
  };
  const cancelButtonStyle = {
    fontSize: "24px",
    color: "#007bff",
    textDecoration: "none",
    cursor: "pointer",
    marginLeft: "10px",
  };

