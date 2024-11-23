import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
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


function CheckoutForm({ handlePayment }) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState(null)
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!stripe || !elements) return

    setProcessing(true)
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    })

    if (error) {
      setError(error.message)
      setProcessing(false)
    } else {
      handlePayment(paymentMethod.id)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={{style: {base: {fontSize: '16px'}}}} />
      {error && <Alert variant="destructive" className="mt-2"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
      <Button type="submit" disabled={!stripe || processing} className="mt-4 w-full">
        {processing ? 'Processing...' : 'Pay with Credit Card'}
      </Button>
    </form>
  )
}

export default function CheckoutPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { cart, currency } = location.state || { cart: [], currency: 'USD' };
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState('');
    const [selectedAddress, setSelectedAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [error, setError] = useState('');
  
    useEffect(() => {
      const fetchAddresses = async () => {
        try {
          const response = await axios.get('http://localhost:5001/api/user/addresses');
          setAddresses(response.data);
        } catch (error) {
          console.error('Error fetching addresses:', error);
          setError('Failed to fetch addresses. Please try again.');
        }
      };
      fetchAddresses();
    }, []);
  
    const handleAddAddress = async () => {
      try {
        const response = await axios.post('http://localhost:5001/api/user/addresses', { address: newAddress });
        setAddresses([...addresses, response.data]);
        setNewAddress('');
      } catch (error) {
        console.error('Error adding address:', error);
        setError('Failed to add address. Please try again.');
      }
    };
  
    const handlePayment = async (paymentMethodId = null) => {
        try {
          const token = localStorage.getItem('token'); // Ensure token exists
          if (!token) {
            throw new Error('User is not authenticated');
          }
      
          const order = {
            items: cart,
            deliveryAddress: selectedAddress || null,
            paymentMethod,
            currency,
            ...(paymentMethod === 'credit-card' && { paymentMethodId }), // Add only if credit card
          };
      
          console.log('Order payload:', order);
      
          let response;
          if (paymentMethod === 'credit-card') {
            response = await axios.post(
              'http://localhost:5001/api/products/pay-with-stripe',
              order,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          } else if (paymentMethod === 'cash') {
            response = await axios.post(
              'http://localhost:5001/api/products/pay-with-cash',
              order,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          } else {
            throw new Error('Invalid payment method');
          }
      
          toast.success('Order placed successfully!');
          navigate('/tourist-page', { state: { order: response.data.order } });
        } catch (error) {
          console.error('Error processing order:', error.response || error);
          setError('There was an error processing your order. Please try again.');
          toast.error('Failed to place order. Please try again.');
        }
      };
      
    const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  
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
                    <span>{currency} {(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between font-bold">
                <span>Total</span>
                <span>{currency} {totalAmount.toFixed(2)}</span>
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="text-lg font-medium mb-2">Delivery Address (Optional)</h3>
              <Select onValueChange={setSelectedAddress}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a delivery address (optional)" />
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
                  <RadioGroupItem value="credit-card" id="credit-card" />
                  <Label htmlFor="credit-card">Credit Card (Stripe)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash">Cash on Delivery</Label>
                </div>
              </RadioGroup>
            </div>
            {paymentMethod === 'credit-card' && (
              <div className="mt-4">
                <Elements stripe={stripePromise}>
                  <CheckoutForm handlePayment={handlePayment} />
                </Elements>
              </div>
            )}
           </CardContent>
          <CardFooter>
            {paymentMethod === 'cash' && (
              <Button className="w-full" onClick={() => handlePayment()}>
                Place Order (Cash on Delivery)
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}





