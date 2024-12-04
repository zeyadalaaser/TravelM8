'use client'

import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast, Toaster } from 'react-hot-toast'

const stripePromise = loadStripe('pk_test_51QNwSmLNUgOldllO51XLfeq4fZCMqG9jUXp4wVgY6uq9wpvjOAJ1XgKNyErFb6jf8rmH74Efclz55kWzG8UDxZ9J0064KdbDCb')

function CheckoutForm({ clientSecret, handlePayment }) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState(null)
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!stripe || !elements) return

    setProcessing(true)
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'http://localhost:5173/tourist-page?type=products&payment=success',
      },
    })

    if (result.error) {
      setError(result.error.message)
      setProcessing(false)
    } else {
      handlePayment(result.paymentIntent.id)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && <Alert variant="destructive" className="mt-2"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
      <Button type="submit" disabled={!stripe || processing} className="mt-4 w-full">
        {processing ? 'Processing...' : 'Pay Now'}
      </Button>
    </form>
  )
}

export default function CheckoutPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { cart, currency } = location.state || { cart: [], currency: 'USD' }
  const [addresses, setAddresses] = useState([])
  const [newAddress, setNewAddress] = useState('')
  const [selectedAddress, setSelectedAddress] = useState('')  // Address not automatically selected
  const [paymentMethod, setPaymentMethod] = useState('')
  const [error, setError] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [walletBalance, setWalletBalance] = useState(0)

  useEffect(() => {
    //const fetchAddresses = async () => {
    //   try {
    //     const token = localStorage.getItem('token')
    //     const response = await axios.get('http://localhost:5001/api/user/addresses', {
    //       headers: { Authorization: `Bearer ${token}` }
    //     })
    //     setAddresses(response.data)
    //   } catch (error) {
    //     console.error('Error fetching addresses:', error)
    //     setError('Failed to fetch addresses. Please try again.')
    //   }
    // }
    // fetchAddresses()

    const fetchWalletBalance = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('User not authenticated')
        }

        const response = await axios.get('http://localhost:5001/api/user/wallet-balance', {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        })

        setWalletBalance(response.data.balance)
      } catch (error) {
        console.error('Error fetching wallet balance:', error)
        setError('Failed to fetch wallet balance. Please try again.')
      }
    }
    fetchWalletBalance()

    if (cart.length > 0) {
      createPaymentIntent()
    }
  }, [cart])

  const createPaymentIntent = async () => {
    try {
      const response = await axios.post('http://localhost:5001/api/create-payment-intent', {
        amount: calculateTotalAmount(),
        currency: currency.toLowerCase(),
      })
      setClientSecret(response.data.clientSecret)
    } catch (error) {
      console.error('Error creating PaymentIntent:', error)
      setError('Failed to initialize payment. Please try again.')
    }
  }

  const calculateTotalAmount = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0) * 100 // in cents
  }

  const handleAddAddress = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post('http://localhost:5001/api/choose-delivery-address',
        { newAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      // Add new address to the list but do not select it automatically
      setAddresses([...addresses, response.data.address])
      setNewAddress('')  // Reset the new address input field
      toast.success('New address added successfully!')
    } catch (error) {
      console.error('Error adding address:', error)
      setError('Failed to add address. Please try again.')
      toast.error('Failed to add address. Please try again.')
    }
  }

  const handleSelectAddress = async (addressId) => {
    try {
      const token = localStorage.getItem('token');
      
      // We need to send either addressId or newAddress in the request body
      let addressData = {};
      if (addressId) {
        addressData = { addressId };  // Send addressId if selecting an existing address
      } else if (newAddress.trim()) {
        addressData = { newAddress };  // Send newAddress if it's a new address
      } else {
        // If neither is provided, log an error or show a message
        throw new Error('Please provide an addressId or a newAddress');
      }
  
      const response = await axios.post('http://localhost:5001/api/choose-delivery-address', 
        addressData, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setSelectedAddress(response.data.address._id);
      toast.success('Delivery address updated successfully!');
    } catch (error) {
      console.error('Error selecting address:', error);
      setError('Failed to select address. Please try again.');
      toast.error(error.message || 'Failed to select address. Please try again.');
    }
  };
  

  const handlePayment = async (paymentIntentId = null) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('User is not authenticated')
      }

      const order = {
        items: cart,
        deliveryAddress: selectedAddress,
        paymentMethod,
        currency,
        ...(paymentMethod === 'credit-card' && { paymentIntentId }),
      }

      let response
      if (paymentMethod === 'credit-card') {
        response = await axios.post(
          'http://localhost:5001/api/products/pay-with-stripe',
          order,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      } else if (paymentMethod === 'cash') {
        response = await axios.post(
          'http://localhost:5001/api/products/pay-with-cash',
          order,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      } else if (paymentMethod === 'wallet') {
        response = await axios.post(
          'http://localhost:5001/api/products/pay-with-wallet',
          order,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      } else {
        throw new Error('Invalid payment method')
      }

      toast.success('Order placed successfully!')
      navigate('/tourist-page?type=products&payment=success', { state: { order: response.data.order } })
    } catch (error) {
      console.error('Error processing order:', error)
      setError(error.response?.data?.message || 'There was an error processing your order. Please try again.')
      toast.error('Failed to place order. Please try again.')
    }
  }

  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Checkout</CardTitle>
            <CardDescription>Complete your order</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div>
              <h3 className="text-lg font-medium">Order Summary</h3>
              <ul className="mt-2 divide-y divide-gray-200">
                {cart.map((item) => (
                  <li key={item._id} className="py-2 flex justify-between">
                    <span>{item.name} x {item.quantity}</span>
                    <span>{(item.price * item.quantity).formatCurrency(currency)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between font-bold">
                <span>Total</span>
                <span>{totalAmount.formatCurrency(currency)}</span>
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="text-lg font-medium mb-2">Delivery Address</h3>
              <Select onValueChange={handleSelectAddress} value={selectedAddress}>
  <SelectTrigger>
    <SelectValue placeholder="Choose a delivery address" />
  </SelectTrigger>
  <SelectContent>
    {addresses.map((address) => (
      <SelectItem key={address._id} value={address._id}>
        {/* Displaying the address string */}
        {address}
      </SelectItem>
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
                  <RadioGroupItem value="credit-card" id="credit-card" />
                  <Label htmlFor="credit-card">Credit Card (Stripe)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash">Cash on Delivery</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="wallet" id="wallet" />
                  <Label htmlFor="wallet">Wallet (Balance: {walletBalance.formatCurrency(currency)})</Label>
                </div>
              </RadioGroup>
            </div>
            {paymentMethod === 'credit-card' && clientSecret && (
              <div className="mt-4">
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm clientSecret={clientSecret} handlePayment={handlePayment} />
                </Elements>
              </div>
            )}
          </CardContent>
          <CardFooter>
            {(paymentMethod === 'cash' || paymentMethod === 'wallet') && (
              <Button
                className="w-full"
                onClick={() => handlePayment()}
                disabled={paymentMethod === 'wallet' && walletBalance < totalAmount}
              >
                Place Order ({paymentMethod === 'cash' ? 'Cash on Delivery' : 'Pay with Wallet'})
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
