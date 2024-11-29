import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle, TruckIcon, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        const response = await axios.get('http://localhost:5001/api/tourists/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data.orders);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.response?.data?.message || 'Failed to fetch orders. Please try again.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5001/api/tourists/orders/cancel-order/${orderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh orders after cancellation
      const response = await axios.get('http://localhost:5001/api/tourists/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.orders);
    } catch (err) {
      console.error('Error cancelling order:', err);
      setError(err.response?.data?.message || 'Failed to cancel order. Please try again.');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Placed': return <AlertCircle className="text-yellow-500" />;
      case 'Shipped': return <TruckIcon className="text-blue-500" />;
      case 'Delivered': return <CheckCircle className="text-green-500" />;
      case 'Cancelled': return <XCircle className="text-red-500" />;
      default: return null;
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading orders...</div>;
  if (error) return (
    <Alert variant="destructive" className="max-w-md mx-auto mt-8">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order._id} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Order #{order._id.slice(-6)}</span>
                  <Badge variant={order.status === 'Cancelled' ? 'destructive' : 'default'}>
                    {getStatusIcon(order.status)}
                    <span className="ml-2">{order.status}</span>
                  </Badge>
                </CardTitle>
                <CardDescription>Placed on {new Date(order.createdAt).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {order.items.slice(0, 2).map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span>{item.product.name} x {item.quantity}</span>
                      <span>${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <div className="text-sm text-gray-500">
                      And {order.items.length - 2} more item(s)
                    </div>
                  )}
                  <Separator className="my-2" />
                  <div className="flex justify-between items-center font-bold">
                    <span>Total</span>
                    <span>${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">View Details</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Order Details</DialogTitle>
                      <DialogDescription>
                        Order #{order._id.slice(-6)} - {order.status}
                      </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="mt-4 max-h-[60vh]">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Items:</h4>
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center mb-2">
                              <span>{item.product.name} x {item.quantity}</span>
                              <span>${item.price.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        <Separator />
                        <div>
                          <h4 className="font-semibold mb-2">Delivery Address:</h4>
                          <p>{order.deliveryAddress.fullName}</p>
                          <p>{order.deliveryAddress.streetName}, {order.deliveryAddress.buildingNumber}</p>
                          <p>{order.deliveryAddress.city}, {order.deliveryAddress.postalCode}</p>
                          <p>{order.deliveryAddress.country}</p>
                        </div>
                        <Separator />
                        <div>
                          <h4 className="font-semibold mb-2">Payment Details:</h4>
                          <p>Method: {order.paymentMethod}</p>
                          <p>Total Amount: ${order.totalAmount.toFixed(2)}</p>
                          {order.deliveryFee > 0 && (
                            <p>Delivery Fee: ${order.deliveryFee.toFixed(2)}</p>
                          )}
                        </div>
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
                {order.status === 'Placed' && (
                  <Button variant="destructive" onClick={() => handleCancelOrder(order._id)}>
                    Cancel Order
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderPage;