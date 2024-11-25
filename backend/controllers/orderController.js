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
  
// Helper function to calculate total amount
const calculateTotalAmount = (items) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
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
      const { items, deliveryAddress } = req.body;
      const userId = req.user.userId;
  
      const totalAmount = calculateTotalAmount(items);
  
      // Find the user and check wallet balance
      const user = await Tourist.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (user.wallet < totalAmount) {
        return res.status(400).json({ message: 'Insufficient wallet balance' });
      }
  
      // Deduct the amount from the wallet
      user.wallet -= totalAmount;
      await user.save();
  
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
        status: 'paid'
      });
  
      await newOrder.save();
  
      res.status(200).json({ message: 'Payment successful', order: newOrder });
    } catch (error) {
      console.error('Error processing wallet payment:', error);
      res.status(500).json({ message: 'Internal server error' });
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
  
  
  //4000056655665556