import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Star,
  SeparatorHorizontal,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Stars } from "@/components/Stars.jsx";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ReviewDialog } from "./ratings/ReviewDialog";
import * as services from "@/pages/tourist/api/apiService.js";
import { useCurrency } from '@/hooks/currency-provider'; 
const statusIcons = {
  Placed: Package,
  Shipped: Truck,
  Delivered: CheckCircle,
  Cancelled: XCircle,
};

const statusColors = {
  Placed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const { currency, exchangeRate } = useCurrency();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const token = localStorage.getItem("token");
  const [dialogData, setDialogData] = useState({
    isOpen: false,
    touristId: null,
    entityId: null,
    entityType: "Product",
    onClose: null,
  });

  useEffect(() => {
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

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await axios.get(
        "http://localhost:5001/api/tourists/orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(response.data.orders);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(
        err.response?.data?.message ||
        "Failed to fetch orders. Please try again."
      );
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  const closeDialog = () => {
    setDialogData((prev) => ({
      ...prev,
      isOpen: false,
    }));
    fetchOrders();

  };
  const openDialog = ({ touristId, entityId }) => {
    setDialogData({
      isOpen: true,
      touristId,
      entityId,
      entityType: "Product",
      onClose: closeDialog,
    });
  };

  const handleCancelOrder = async (order) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5001/api/tourists/orders/cancel-order/${order._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const response = await axios.get(
        "http://localhost:5001/api/tourists/orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(response.data.orders);
      setOrders((prevOrders) =>
        prevOrders.map((orderrr) =>
          orderrr._id === order._id
            ? { ...orderrr, status: "Cancelled" }
            : orderrr
        )
      );
      toast(`Order #${order._id.slice(-6)} has been cancelled successfully`, {
        description: (
          <>
            Amount added to wallet: {(order.totalAmount * exchangeRate).formatCurrency(currency)}
            <br />
            New wallet balance: {((order.totalAmount + profile?.wallet) * exchangeRate).formatCurrency(currency)}
          </>
        ),
      });
    } catch (err) {
      console.error("Error cancelling order:", err);
      setError(
        err.response?.data?.message ||
        "Failed to cancel order. Please try again."
      );
    }
  };

  const filteredOrders = orders.filter(
    (order) => statusFilter === "all" || order.status === statusFilter
  );

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const cancelOrder = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: "Cancelled" } : order
      )
    );
    toast("Order Cancelled", {
      description: `Order ${orderId} has been cancelled successfully.`,
    });
  };

  //   if (loading) return <div className="flex justify-center items-center h-screen">Loading orders...</div>;
  //   if (error) return (
  //     <Alert variant="destructive" className="max-w-md mx-auto mt-8">
  //       <AlertCircle className="h-4 w-4" />
  //       <AlertTitle>Error</AlertTitle>
  //       <AlertDescription>{error}</AlertDescription>
  //     </Alert>
  //   );

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Select onValueChange={(value) => setStatusFilter(value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="Placed">Placed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-6">
        {filteredOrders.map((order) => {
          const StatusIcon = statusIcons[order.status];
          return (
            <Card
              key={order._id}
              className="overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <CardHeader className="bg-gray-50 dark:bg-gray-800">
                <CardTitle className="flex justify-between items-center">
                  <span className="text-xl">Order #{order._id.slice(-6)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleOrderExpansion(order._id)}
                    aria-expanded={expandedOrder === order._id}
                    aria-controls={`order-details-${order._id}`}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {expandedOrder === order._id ? (
                      <ChevronUp />
                    ) : (
                      <ChevronDown />
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <span className="font-semibold text-lg text-gray-700 dark:text-gray-300">
                    {(order.totalAmount * exchangeRate).formatCurrency(currency)}
                  </span>
                </div>
                <AnimatePresence>
                  {expandedOrder === order._id && (
                    <motion.div
                      id={`order-details-${order._id.slice(-6)}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        Order Items:
                      </h3>
                      {order.status !== "Cancelled" ? (
                        <ul className="space-y-2">
                          {order.items.map((item, index) => (
                            <li
                              key={index}
                              className="grid grid-cols-2 gap-4 p-4 border rounded-md shadow-sm text-gray-600 dark:text-gray-400"
                            >
                              {/* First row: Name and Price */}
                              <div className="flex justify-between col-span-2">
                                <span>
                                  {item.product.name} (x{item.quantity})
                                </span>
                                <span>
                                  {(item.product.price * item.quantity * exchangeRate).formatCurrency(currency)}
                                </span>
                              </div>
                              <hr className="col-span-2 border-gray-300 my-2" />
                              <div className="flex justify-end col-span-2 space-x-2">
                                <div className="w-full items-center flex justify-between m-auto">
                                  <div className="">
                                    {item.review && (
                                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                        <span className="font-semibold">Your Rating :</span>
                                        <Stars rating={item.review.rating} />
                                      </div>
                                    )}
                                    {item.review && (
                                      <div className="gap-2 text-sm flex text-gray-600">
                                        <p className="font-semibold">Your Comment :</p>
                                        <p className="italic">
                                          &quot;{item.review?.comment}&quot;
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <Button
                                  className="h-fit w-fit m-auto"
                                  onClick={() => {
                                    console.log(profile._id);
                                    openDialog({
                                      touristId: profile._id,
                                      entityId: item.product,
                                    });
                                  }}
                                >
                                  <Star className="mr-1 h-4 w-4" />
                                  Rate
                                </Button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <ul className="space-y-2">
                          {order.items.map((item, index) => (
                            <li
                              key={index}
                              className="flex justify-between text-gray-600 dark:text-gray-400"
                            >
                              <span>
                                {item.product.name} (x{item.quantity})
                              </span>
                              <span>
                              {(item.product.price * item.quantity * exchangeRate).formatCurrency(currency)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
              <CardFooter className="flex justify-between items-center ">
                {order.status !== "Cancelled" && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleCancelOrder(order)}
                  >
                    Cancel Order
                  </Button>
                )}

                {order.status === "Cancelled" && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {"Order cancelled"}
                  </span>
                )}
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center ${statusColors[order.status]
                    }`}
                >
                  <StatusIcon className="h-4 w-4 mr-1" />
                  {order.status}
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      <ReviewDialog
        isOpen={dialogData.isOpen}
        onClose={closeDialog}
        touristId={dialogData.touristId}
        entityId={dialogData.entityId}
        entityType={dialogData.entityType}
      />
    </>
  );
};

export default MyOrdersPage;
