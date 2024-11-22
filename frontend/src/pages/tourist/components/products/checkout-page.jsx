import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

function CheckoutPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { cart, currency } = location.state || { cart: [], currency: 'USD' }
  const [addresses, setAddresses] = useState([])
  const [newAddress, setNewAddress] = useState('')
  const [selectedAddress, setSelectedAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')

  useEffect(() => {
    // Fetch user's addresses
    const fetchAddresses = async () => {
      try {
        const response = await axios.get('http://localhost:5001/user/addresses')
        setAddresses(response.data)
      } catch (error) {
        console.error('Error fetching addresses:', error)
      }
    }
    fetchAddresses()
  }, [])

  const handleAddAddress = async () => {
    try {
      const response = await axios.post('/api/user/addresses', { address: newAddress })
      setAddresses([...addresses, response.data])
      setNewAddress('')
    } catch (error) {
      console.error('Error adding address:', error)
    }
  }

  const handleCheckout = async () => {
    if (!selectedAddress || !paymentMethod) {
      alert('Please select a delivery address and payment method')
      return
    }

    try {
      const order = {
        items: cart,
        deliveryAddress: selectedAddress,
        paymentMethod,
        currency
      }
      const response = await axios.post('/api/orders', order)
      navigate('/order-confirmation', { state: { order: response.data } })
    } catch (error) {
      console.error('Error processing order:', error)
      alert('There was an error processing your order. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Checkout</CardTitle>
            <CardDescription>Complete your order</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Order Summary</h3>
              <ul className="mt-2 divide-y divide-gray-200">
                {cart.map((item) => (
                  <li key={item._id} className="py-2 flex justify-between">
                    <span>{item.name} x {item.quantity}</span>
                    <span>{currency} {(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between font-bold">
                <span>Total</span>
                <span>{currency} {cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</span>
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="text-lg font-medium mb-2">Delivery Address</h3>
              <Select onValueChange={setSelectedAddress}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a delivery address" />
                </SelectTrigger>
                <SelectContent>
                  {addresses.map((address, index) => (
                    <SelectItem key={index} value={address}>{address}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-4 flex space-x-2">
                <Input
                  placeholder="Add a new address"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                />
                <Button onClick={handleAddAddress}>Add</Button>
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="text-lg font-medium mb-2">Payment Method</h3>
              <RadioGroup onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="wallet" id="wallet" />
                  <Label htmlFor="wallet">Wallet</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="credit-card" id="credit-card" />
                  <Label htmlFor="credit-card">Credit Card (Stripe)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash">Cash on Delivery</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleCheckout}>Place Order</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
export default CheckoutPage;