"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import {
  Elements,
  CardElement,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar.jsx";
import { CircularProgress } from "@mui/material";
import * as services from "@/pages/tourist/api/apiService.js";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { NumberStepper } from "@/components/ui/number-stepper";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CheckoutToast } from "@/pages/tourist/components/products/checkoutToast.jsx";
import { loadStripe } from "@stripe/stripe-js";
import { useCurrency } from "../../../../hooks/currency-provider";
 

const stripePromise = loadStripe(
  "pk_test_51QNwSmLNUgOldllO51XLfeq4fZCMqG9jUXp4wVgY6uq9wpvjOAJ1XgKNyErFb6jf8rmH74Efclz55kWzG8UDxZ9J0064KdbDCb"
);

function CheckoutForm({ clientSecret, handlePayment }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url:
          "http://localhost:5173/tourist-page?type=products&payment=success",
      },
    });

    if (result.error) {
      setError(result.error.message);
      setProcessing(false);
    } else {
      handlePayment(result.paymentIntent.id);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = location.state || {};
  const searchParams = new URLSearchParams(location.search);
  const { currency, exchangeRate } = useCurrency();
  const [isLoading, setIsLoading] = useState(true);
  const [showAddAddressDialog, setShowAddAddressDialog] = useState(false);
  const [showDeliveryForm, setShowDeliveryForm] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [showPromotionCode, setShowPromotionCode] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [PromoCodeValue, setPromoCodeValue] = useState(null);
  const token = localStorage.getItem("token");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [profile, setProfile] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newAddress = {
      country: formData.get("country"),
      fullName: formData.get("fullName"),
      mobileNumber: `${formData.get("countryCode")}${formData.get(
        "mobileNumber"
      )}`,
      streetName: formData.get("streetName"),
      buildingNumber: formData.get("buildingNumber"),
      city: formData.get("city"),
      postalCode: formData.get("postalCode"),
    };
    setAddresses((prevAddresses) => [...prevAddresses, newAddress]);
    setShowAddAddressDialog(false);
    event.target.reset();
  };

  const [cartItems, setCartItems] = useState(cart || []);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    const getProfileInfo = async () => {
      try {
        const data = await services.fetchProfileInfo(token);
        setProfile(data);
      } catch (err) {
        setError("Failed to fetch profile information.");
      }
    };

    getProfileInfo();
  }, [navigate, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeliveryAddress({ ...deliveryAddress, [name]: value });
  };

  useEffect(() => {
    if (cart) {
      setCartItems(cart);
    }
  }, [cart]);

  const updateItemQuantity = async (item, newQuantity) => {
    console.log(item);
    try {
      await axios.put(
        `http://localhost:5001/api/tourists/cart/${item.productId._id}`,
        { quantity: newQuantity },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setCartItems((prevCart) =>
        prevCart.map((sth) =>
          sth._id === item._id ? { ...sth, quantity: newQuantity } : sth
        )
      );
      if (newQuantity === 0) {
        setCartItems((prevCart) =>
          prevCart.filter((sth) => sth._id !== item._id)
        );
      }
    } catch (error) {
      console.error("Failed to update item quantity:", error);
    }
  };
  
  const totalPrice = cart?.reduce(
    (acc, item) => acc + item.productId.price * item.quantity,
    0
  );

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const fetchMyAddresses = async () => {
    try {
      const response = await services.getMyAddresses(token);
      setAddresses(response.addresses);
      console.log(response);
    } catch (error) {
      console.error("Message:", error.message);
    }
  };

  useEffect(() => {
    fetchMyAddresses();
    if (cart.length > 0) {
      createPaymentIntent();
    }
  }, [cart]);

  const checkout = async () => {
    if (selectedAddressId) {
      const address = addresses.find(
        (addr) => addr.fullName === selectedAddressId
      );
      try {
        const response = await services.checkout(
          { address, paymentMethod, PromoCodeValue },
          token
        );
        CheckoutToast(
          (profile?.wallet - totalPrice - 20).formatCurrency(currency),
          paymentMethod
        );
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } catch (error) {
        console.log(selectedAddressId);
        console.log("helllo", error);
        setError(error.response?.message);
      }
    } else {
      setError(error.response?.message || "Please select an address");
    }
  };

  const createPaymentIntent = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/create-payment-intent",
        {
          amount: totalPrice + 20 ,
          targetCurrency: currency,
          currency: "USD",
        }
      );
      setClientSecret(response.data.clientSecret);
    } catch (error) {
      console.error("Error creating PaymentIntent:", error);
      setError("Failed to initialize payment. Please try again.");
    }
  };

  const handlePromoCodeChange = (e) => {
    const promo = e.target.value;
    setPromoCode(promo);  // This stores just the string value of the input
  };
  const handlePromoCode = async () => {
    try {
      console.log("Promo code value:", promoCode);
      // Send the promoCode to the backend
      const response = await axios.post(
        `http://localhost:5001/api/use-promo-code`, 
        {
          promoCode,   
        }
      );
      console.log("Response from backend:", response);
      if (response.data && response.data.message) {
        toast(response.data.message);
      //  alert(response.data.message);   
      }   if (response.data && response.data.value) {
        setPromoCodeValue(response.data.value);   
      }
      else {
        alert("Unknown response format");
      }
    } catch (error) {
      console.error("Error occurred:", error);
       
      toast(error.response?.data?.message || error.message);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      {isLoading ? (
        <div style={spinnerStyle}>
          <CircularProgress />
        </div>
      ) : (
        <>
           
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
                    value={selectedAddressId}
                    onValueChange={(value) => setSelectedAddressId(value)}
                    className="space-y-4"
                  >
                    {addresses.map((addr) => (
                      <div
                        key={addr._id}
                        className="flex items-start space-x-3 rounded-lg border p-4"
                      >
                        <RadioGroupItem
                          value={addr.fullName}
                          id={addr.fullName}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor={addr.fullName}
                            className="font-medium"
                          >
                            {addr.fullName}
                          </Label>
                          <p className="text-sm text-gray-600 mt-1">
                            {addr.streetName}, {addr.postalCode}, Building{" "}
                            {addr.buildingNumber}
                          </p>
                          {addr.city && (
                            <p className="text-sm text-gray-600">
                              {addr.city}, {addr.country}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                  <Dialog
                    open={showAddAddressDialog}
                    onOpenChange={setShowAddAddressDialog}
                  >
                    <DialogTrigger>
                      <button className="text-blue-600 flex items-center gap-2 mt-4">
                        <span className="text-xl">+</span> Add a new address{" "}
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Enter a new shipping address</DialogTitle>
                      </DialogHeader>
                      <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country/region</Label>
                          <Select name="country" defaultValue="Egypt">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Saudi Arabia">
                                Saudi Arabia
                              </SelectItem>
                              <SelectItem value="United Arab Emirates">
                                United Arab Emirates
                              </SelectItem>
                              <SelectItem value="Kuwait">Kuwait</SelectItem>
                              <SelectItem value="United States">
                                United States
                              </SelectItem>
                              <SelectItem value="Canada">Canada</SelectItem>
                              <SelectItem value="United Kingdom">
                                United Kingdom
                              </SelectItem>
                              <SelectItem value="Australia">
                                Australia
                              </SelectItem>
                              <SelectItem value="India">India</SelectItem>
                              <SelectItem value="Pakistan">Pakistan</SelectItem>
                              <SelectItem value="Egypt">Egypt</SelectItem>
                              <SelectItem value="South Africa">
                                South Africa
                              </SelectItem>
                              <SelectItem value="Germany">Germany</SelectItem>
                              <SelectItem value="France">France</SelectItem>
                              <SelectItem value="China">China</SelectItem>
                              <SelectItem value="Japan">Japan</SelectItem>
                              <SelectItem value="South Korea">
                                South Korea
                              </SelectItem>
                              <SelectItem value="Brazil">Brazil</SelectItem>
                              <SelectItem value="Mexico">Mexico</SelectItem>
                              <SelectItem value="Italy">Italy</SelectItem>
                              <SelectItem value="Spain">Spain</SelectItem>
                              <SelectItem value="Russia">Russia</SelectItem>
                              <SelectItem value="Turkey">Turkey</SelectItem>
                              <SelectItem value="Indonesia">
                                Indonesia
                              </SelectItem>
                              <SelectItem value="Malaysia">Malaysia</SelectItem>
                              <SelectItem value="Singapore">
                                Singapore
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="fullName">
                            Full name (First and Last name)
                          </Label>
                          <Input
                            id="fullName"
                            name="fullName"
                            placeholder="Enter your full name"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="mobileNumber">Mobile number</Label>
                          <div className="flex gap-2">
                            <Select name="countryCode" defaultValue="+966">
                              <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Code" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="+966">🇸🇦 +966</SelectItem>{" "}
                                {/* Saudi Arabia */}
                                <SelectItem value="+971">
                                  🇦🇪 +971
                                </SelectItem>{" "}
                                {/* United Arab Emirates */}
                                <SelectItem value="+965">
                                  🇰🇼 +965
                                </SelectItem>{" "}
                                {/* Kuwait */}
                                <SelectItem value="+1">🇺🇸 +1</SelectItem>{" "}
                                {/* United States */}
                                <SelectItem value="+44">🇬🇧 +44</SelectItem>{" "}
                                {/* United Kingdom */}
                                <SelectItem value="+91">🇮🇳 +91</SelectItem>{" "}
                                {/* India */}
                                <SelectItem value="+92">🇵🇰 +92</SelectItem>{" "}
                                {/* Pakistan */}
                                <SelectItem value="+20">🇪🇬 +20</SelectItem>{" "}
                                {/* Egypt */}
                                <SelectItem value="+27">🇿🇦 +27</SelectItem>{" "}
                                {/* South Africa */}
                                <SelectItem value="+49">🇩🇪 +49</SelectItem>{" "}
                                {/* Germany */}
                                <SelectItem value="+33">🇫🇷 +33</SelectItem>{" "}
                                {/* France */}
                                <SelectItem value="+86">🇨🇳 +86</SelectItem>{" "}
                                {/* China */}
                                <SelectItem value="+81">🇯🇵 +81</SelectItem>{" "}
                                {/* Japan */}
                                <SelectItem value="+82">🇰🇷 +82</SelectItem>{" "}
                                {/* South Korea */}
                                <SelectItem value="+55">🇧🇷 +55</SelectItem>{" "}
                                {/* Brazil */}
                                <SelectItem value="+52">🇲🇽 +52</SelectItem>{" "}
                                {/* Mexico */}
                                <SelectItem value="+39">🇮🇹 +39</SelectItem>{" "}
                                {/* Italy */}
                                <SelectItem value="+34">🇪🇸 +34</SelectItem>{" "}
                                {/* Spain */}
                                <SelectItem value="+7">🇷🇺 +7</SelectItem>{" "}
                                {/* Russia */}
                                <SelectItem value="+90">🇹🇷 +90</SelectItem>{" "}
                                {/* Turkey */}
                                <SelectItem value="+62">🇮🇩 +62</SelectItem>{" "}
                                {/* Indonesia */}
                                <SelectItem value="+60">🇲🇾 +60</SelectItem>{" "}
                                {/* Malaysia */}
                                <SelectItem value="+65">🇸🇬 +65</SelectItem>{" "}
                                {/* Singapore */}
                                <SelectItem value="+61">🇦🇺 +61</SelectItem>{" "}
                                {/* Australia */}
                                <SelectItem value="+1">🇨🇦 +1</SelectItem>{" "}
                                {/* Canada */}
                                <SelectItem value="+48">🇵🇱 +48</SelectItem>{" "}
                                {/* Poland */}
                                <SelectItem value="+63">🇵🇭 +63</SelectItem>{" "}
                                {/* Philippines */}
                                <SelectItem value="+94">🇱🇰 +94</SelectItem>{" "}
                                {/* Sri Lanka */}
                                <SelectItem value="+880">
                                  🇧🇩 +880
                                </SelectItem>{" "}
                                {/* Bangladesh */}
                              </SelectContent>
                            </Select>
                            <Input
                              className="flex-1"
                              id="mobileNumber"
                              name="mobileNumber"
                              placeholder="e.g. 05XXXXXXXX"
                              required
                            />
                          </div>
                          <p className="text-sm text-gray-500">
                            May be used to assist delivery
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="streetName">Street name</Label>
                          <Input
                            id="streetName"
                            name="streetName"
                            placeholder="e.g. Al Oruba Street"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="buildingNumber">
                            Building name/no
                          </Label>
                          <Input
                            id="buildingNumber"
                            name="buildingNumber"
                            placeholder="e.g. Princess Tower"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            name="city"
                            placeholder="e.g. Riyadh, Jeddah, Makkah, Al Ahsa"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="city">Postal Code</Label>
                          <Input
                            id="postalCode"
                            name="postalCode"
                            placeholder="e.g. 11814"
                            required
                          />
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                          <Button
                            variant="outline"
                            type="button"
                            onClick={() => setShowAddAddressDialog(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="bg-green-800 hover:bg-green-900 text-white"
                            type="submit"
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
                    <div
                      className={`rounded-lg border p-4 ${
                        paymentMethod === "credit-card" ? "bg-white" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="credit-card" id="credit-card" />
                        <Label htmlFor="credit-card">Credit/Debit Card</Label>
                      </div>
                      {paymentMethod === "credit-card" && clientSecret && (
                        <div className="mt-4">
                          <Elements
                            stripe={stripePromise}
                            options={{ clientSecret }}
                          >
                            <CheckoutForm
                              clientSecret={clientSecret}
                              handlePayment={checkout}
                            />
                          </Elements>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-4">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash">Cash on Delivery</Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-4">
                      <RadioGroupItem value="wallet" id="wallet" />
                      <Label htmlFor="wallet">Wallet Balance</Label>
                      <p className="text-xs text-gray-500">
                        (
                        {profile
                          ? profile.wallet.formatCurrency(currency)
                          : Number(0).formatCurrency(currency)}
                        )
                      </p>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            {/* Order Summary Card */}
            <div>
              <Card className="min-h-[50vh] mt-12  flex flex-col p-2">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto">
                  {cart?.map((item) => (
                    <>
                      <div
                        key={item._id}
                        className="flex items-center justify-between p-4"
                      >
                        <div className="flex-1">
                          <h3 className="font-medium">{item.productId.name}</h3>
                        </div>
                        <p className="text-sm text-gray-500">
                          {(
                            item.productId.price * exchangeRate
                          ).formatCurrency(currency)}
                        </p>
                      </div>
                      <Separator />
                    </>
                  ))}
                </CardContent>
                <div className="px-4 mb-4">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Enter promo code"
           value={promoCode}
            onChange={handlePromoCodeChange}
          />
          <Button onClick={handlePromoCode} variant="outline">
            Apply
          </Button>
        </div>
      </div>
      <div className="mb-4 space-y-2 pt-4 px-4">
  <div className="flex justify-between">
    <span className="text-gray-500">Subtotal</span>
    <span>
      {(totalPrice * exchangeRate).formatCurrency(currency)}
    </span>
  </div>

  {/* Check if PromoCodeValue exists and render accordingly */}
  {PromoCodeValue && (
    <>
      {/* Promo code value (discount amount) */}
      <div className="flex justify-between text-600">
        <span>Promo code discount</span>
        <span>${PromoCodeValue}</span>
      </div>
      <Separator />
      {/* Value after promo code */}
      <div className="flex justify-between font-medium">
        <span className="text-gray-500">Subtotal after promo code</span>
        <span>
          {(totalPrice * exchangeRate - PromoCodeValue).formatCurrency(
            currency
          )}
        </span>
      </div>
    </>
  )}

  {/* Shipping */}
  <div className="flex justify-between">
    <span className="text-gray-500">Shipping</span>
    <span>{Number(20).formatCurrency(currency)}</span>
  </div>

  {/* Total (with or without promo code applied) */}
  <div className="flex justify-between font-medium">
    <span>Total ({currency})</span>
    <span>
      {PromoCodeValue
        ? ((totalPrice + 20 - PromoCodeValue) * exchangeRate).formatCurrency(currency)
        : ((totalPrice + 20) * exchangeRate).formatCurrency(currency)}
    </span>
  </div>

  <Button
    onClick={checkout}
    className="w-full bg  text-white hover:bg "
  >
    Confirm Order
  </Button>
  <Button
      onClick={() => navigate("/")} // Navigate directly inside the onClick
      className="w-full bg text-white hover:bg-red"
    >
      Cancel  
    </Button>
 
                  {error && <p style={{ color: "red" }}>{error}</p>}
                  {success && <p style={{ color: "green" }}>{success}</p>}
                </div>
              </Card>
            </div>
          </main>
        </>
      )}
    </div>
  );
}

const spinnerStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(255, 255, 255, 0.7)", // Optional, for overlay effect
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
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
  );
}
const navbarStyle = {
  backgroundColor: "bg-gray-50",
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
