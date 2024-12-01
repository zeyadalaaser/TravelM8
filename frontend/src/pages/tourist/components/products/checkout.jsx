"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MinusIcon, PlusIcon, ShoppingBagIcon, MenuIcon, XIcon } from 'lucide-react'
import { useState } from "react"
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar.jsx";

// Mock addresses data
const addresses = [
  {
    id: 1,
    name: "Sara Hussein",
    address: "FLAT 3102 PIONEER POINT NORTH TOWER 3, WINSTON WAY, ILFORD, IG1 2ZD",
    country: "United Kingdom"
  },
  {
    id: 2,
    name: "Mahmoud Awad",
    address: "Prince Sultan Road, 205 طريق جدة للوحدات السكنية, منطقة",
    city: "Jeddah",
    region: "Makkah",
    country: "Saudi Arabia"
  },
  {
    id: 3,
    name: "Mohamed Taha",
    address: "Almukall Street, 12485, North Building, apartment number: 19, Second Floor",
    city: "Riyadh",
    region: "Riyadh",
    country: "Saudi Arabia"
  }
]

export default function CheckoutPage() {
  const [showAddAddressDialog, setShowAddAddressDialog] = useState(false)
  const [showDeliveryForm, setShowDeliveryForm] = useState(true)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [showPromotionCode, setShowPromotionCode] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState(addresses[0].id)

  return (
    <div className="min-h-screen mt-12 bg-[#FAF9F6]">
        {/* <div className="mt-12">
        <button>back to cart</button> </div> */}
        <Navbar />
          <main className="mx-auto grid max-w-7xl gap-8 p-8 md:grid-cols-[2fr_1fr]">
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
                                  value={selectedAddress.toString()}
                                  onValueChange={(value) => setSelectedAddress(parseInt(value))}
                                  className="space-y-4"
                              >
                                  {addresses.map((addr) => (
                                      <div key={addr.id} className="flex items-start space-x-3 rounded-lg border p-4">
                                          <RadioGroupItem value={addr.id.toString()} id={`address-${addr.id}`} className="mt-1" />
                                          <div className="flex-1">
                                              <Label htmlFor={`address-${addr.id}`} className="font-medium">
                                                  {addr.name}
                                              </Label>
                                              <p className="text-sm text-gray-600 mt-1">{addr.address}</p>
                                              {addr.city && (
                                                  <p className="text-sm text-gray-600">
                                                      {addr.city}, {addr.region}, {addr.country}
                                                  </p>
                                              )}
                                              <div className="flex gap-4 mt-2">
                                                  <button className="text-blue-600 text-sm hover:underline">Edit</button>
                                                  <button className="text-blue-600 text-sm hover:underline">
                                                      Add delivery instructions
                                                  </button>
                                              </div>
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
                                    <button type="button" className="text-sm text-blue-600">
                                        Can't find your city? Try a different spelling
                                    </button>
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
                  <div className="border-b pb-6">
                      <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                              <span className="text-2xl font-semibold">3</span>
                              <h2 className="text-xl font-semibold">Review your order</h2>
                          </div>
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
                          <div className="flex items-center justify-between p-4">
                              <div className="flex-1">
                                  <h3 className="font-medium">Portable Stereo Speaker</h3>
                              </div>
                              <p className="text-sm text-gray-500">$250.49</p>
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between p-4">
                              <div className="flex-1">
                                  <h3 className="font-medium">C-Type Instant Camera</h3>
                              </div>
                              <p className="text-sm text-gray-500">$450.20</p>
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between p-4">
                              <div className="flex-1">
                                  <h3 className="font-medium">Positive Vibration ANC</h3>
                              </div>
                              <p className="text-sm text-gray-500">$350.00</p>
                          </div>
                      </CardContent>


                      {/* Footer with Subtotal, Shipping, Total, and Confirm Order */}
                      <div className="mb-4 space-y-2 pt-4 px-4">
                          <div className="flex justify-between">
                              <span className="text-gray-500">Subtotal</span>
                              <span>$1050.32</span>
                          </div>
                          <div className="flex justify-between">
                              <span className="text-gray-500">Shipping</span>
                              <span>$0.00</span>
                          </div>
                          <div className="flex justify-between font-medium">
                              <span>Total (USD)</span>
                              <span>$1050.32</span>
                          </div>
                          <Button className="w-full bg-green-800 text-white hover:bg-green-900">
                              Confirm Order
                          </Button>
                      </div>
                  </Card>
              </div>
          </main>
      </div>
  )
}

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

