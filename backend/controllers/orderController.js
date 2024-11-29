import Stripe from 'stripe';
import Order from '../models/orderModel.js';
import Tourist from '../models/touristModel.js';


const stripe = new Stripe('sk_test_51QNwSmLNUgOldllO81Gcdv4m60Pf04huhn0DcH2jm0NedAn6xh3krj5GyJ9PEojkKCJYmGJGojBK12S52FktB5Jc00dYqr1Ujo');


export const createPaymentIntent = async (req, res) => {
    try {
      const { amount, currency } = req.body;
  
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
      });
  
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
export const payWithStripe = async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethodId, currency } = req.body;
    const userId = req.user.userId;

    const totalAmount = calculateTotalAmount(items);

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Stripe expects amount in cents
      currency: currency.toLowerCase(),
      payment_method: paymentMethodId,
      confirm: true,
    });

    if (paymentIntent.status === 'succeeded') {
      // Create new order
      const newOrder = new Order({
        user: userId,
        items: items.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount,
        deliveryAddress,
        paymentMethod: 'credit-card',
        status: 'paid',
        stripePaymentIntentId: paymentIntent.id
      });

      await newOrder.save();

      res.status(200).json({ message: 'Payment successful', order: newOrder });
    } else {
      res.status(400).json({ message: 'Payment failed' });
    }
  } catch (error) {
    console.error('Error processing Stripe payment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const payWithCash = async (req, res) => {
    try {
      const { items, deliveryAddress } = req.body;
      const userId = req.user.userId;
  
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Invalid or empty items array' });
      }
  
      const totalAmount = calculateTotalAmount(items);
  
      // Create new order
      const newOrder = new Order({
        user: userId,
        items: items.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount,
        deliveryAddress: deliveryAddress || 'Not provided',
        paymentMethod: 'cash',
        status: 'placed',
        deliveryFee: 0 // Add a default delivery fee or calculate it based on your business logic
      });
  
      await newOrder.save();
  
      res.status(200).json({ message: 'Order placed successfully', order: newOrder });
    } catch (error) {
      console.error('Error processing cash on delivery order:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };
  export const payWithWallet = async (req, res) => {
    try {
      console.log('Received request body:', JSON.stringify(req.body, null, 2));
      console.log('User object from request:', JSON.stringify(req.user, null, 2));
  
      const { items, deliveryAddress } = req.body;
      const userId = req.user.userId;
  
      console.log('User ID:', userId);
  
      if (!items || !Array.isArray(items) || items.length === 0) {
        console.log('Invalid items array');
        return res.status(400).json({ message: 'Invalid or empty items array' });
      }
  
      const totalAmount = calculateTotalAmount(items);
      console.log('Total amount:', totalAmount);
  
      const user = await Tourist.findById(userId);
      if (!user) {
        console.error('User not found for ID:', userId);
        return res.status(404).json({ message: 'User not found' });
      }
  
      console.log('User wallet balance:', user.wallet);
  
      if (user.wallet < totalAmount) {
        console.log('Insufficient wallet balance');
        return res.status(400).json({ message: 'Insufficient wallet balance' });
      }
  
      // Create new order
      const newOrder = new Order({
        user: userId,
        items: items.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount,
        deliveryAddress: deliveryAddress || 'Not provided',
        paymentMethod: 'wallet',
        status: 'placed',
        deliveryFee: 0 // You may want to calculate this based on your business logic
      });
  
      console.log('New order created:', JSON.stringify(newOrder, null, 2));
  
      // Save the order first
      await newOrder.save();
      console.log('Order saved successfully');
  
      // Deduct the amount from the wallet
      user.wallet -= totalAmount;
      await user.save();
      console.log('User wallet updated');
  
      res.status(200).json({ message: 'Payment successful', order: newOrder });
    } catch (error) {
      console.error('Error processing wallet payment:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({ message: 'Internal server error', error: error.message, stack: error.stack });
    }
  };

  export const getWalletBalance = async (req, res) => {
    try {
      const userId = req.user?.userId; // Check if userId is available in req.user
      console.log('Fetching wallet balance for userId:', userId);
  
      const user = await Tourist.findById(userId);
      if (!user) {
        console.error('User not found for userId:', userId);
        return res.status(404).json({ message: 'User not found' });
      }
  
      console.log('Wallet balance retrieved:', user.wallet); // Debug wallet balance
      res.status(200).json({ balance: user.wallet });
    } catch (error) {
      console.error('Error fetching wallet balance:', error.message || error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const isAddressEqual = (addr1, addr2) => {
    return addr1.fullName === addr2.fullName &&
           addr1.mobileNumber === addr2.mobileNumber &&
           addr1.streetName === addr2.streetName &&
           addr1.buildingNumber === addr2.buildingNumber &&
           addr1.city === addr2.city &&
           addr1.postalCode === addr2.postalCode &&
           addr1.country === addr2.country;
  };
  
  export const checkout = async (req, res) => {
    try {
      const userId = req.user?.userId; // Assumes user ID is extracted from token
      const { address, paymentMethod, promoCode } = req.body;
  
      // Find user and populate cart details
      const user = await Tourist.findById(userId).populate("cart.productId");
      if (user.cart.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }
      if (user && user.cart) {
        for (const item of user.cart) {
          if (item.productId) {
            item.productId.sales += 1; 
            item.productId.quantity-=item.quantity;
            await item.productId.save(); 
          }
        }
      }
      let totalAmount = user.cart.reduce(
        (acc, item) => acc + item.quantity * item.productId.price,
        0
      );
      let deliveryAddress;
      if (user.address.some(addr => isAddressEqual(addr, address))) {
        deliveryAddress = address;
      } else {
        user.address.push(address);
        deliveryAddress = address;
      }
  
      const deliveryFee = 20; 
      totalAmount += deliveryFee;
      if (promoCode) {
        const discount = 0.1 * totalAmount;
        totalAmount -= discount;
      }
      let stripePaymentIntentId = null;
      if (paymentMethod === 'credit-card') {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(totalAmount * 100), 
          currency: 'usd',
          payment_method_types: ['card'],
        });
        stripePaymentIntentId = paymentIntent.id;
      } else if (paymentMethod === 'wallet') {
        if (user.wallet < totalAmount) {
          return res.status(400).json({ message: 'Insufficient wallet balance' });
        }
        user.wallet -= totalAmount;
      } else if (paymentMethod !== 'cash') {
        return res.status(400).json({ message: 'Invalid payment method' });
      }

      const order = await Order.create({
        user: userId,
        items: user.cart.map((item) => ({
          product: item.productId._id,
          quantity: item.quantity,
          price: item.productId.price,
        })),
        totalAmount,
        deliveryFee,
        deliveryAddress,
        paymentMethod,
        stripePaymentIntentId,
        status: 'Placed', // Default status
      });
      user.cart = [];
      await user.save();
      await order.save();
  
      res.status(201).json({ message: "Order placed successfully", order });
    } catch (error) {
      res.status(500).json({ message: "Checkout failed", error: error.message });
    }
  };
  

  export const getOrders = async (req, res) => {
    try {
      const userId = req.user?.userId; // Assumes user ID is extracted from token
  
      // Find orders for the logged-in user
      const orders = await Order.find({ user: userId }).sort({ createdAt: -1 })
       .populate({
        path: "items.product",
        model: "Product", 
      });; 
  
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: "No orders found" });
      }
  
      res.status(200).json({ orders });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders", error: error.message });
    }
  };
  

 export const updateOrderStatus = async (req, res) => {
    try {
      const userId = req.user?.userId;
      const { orderId } = req.params;
      const {status } = req.body;
  
      if (!["Placed", "Shipped", "Delivered", "Cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid order status" });
      }
  
      const order = await Order.findByIdAndUpdate(
        orderId,
        { status: status },
        { new: true }
      );
  
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      res.status(200).json({ message: "Order status updated", order });
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status", error });
    }
  };

  export const cancelOrder = async (req, res) => {
    try {
      const userId = req.user?.userId;
      const user = await Tourist.findById(userId);
      const { id } = req.params;
      const order = await Order.findByIdAndUpdate(
        id,
        { status: "Cancelled" },
        { new: true } 
      ).populate("items.product");      
      if (order.paymentMethod==="wallet") {
        user.wallet= user.wallet + order.totalAmount;
      }
      for (const item of order.items) {
          if (item.product) {
            item.product.quantity+=item.quantity;
            item.product.sales -= 1; 
            await item.product.save(); 
          }
      }
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      user.save();
      res.status(200).json({ message: "Order cancelled successfully", order });
    } catch (error) {
      res.status(500).json({ message: "Failed to cancel order", error });
    }
  };
  
  
  
  
  
  //4000056655665556