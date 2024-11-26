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

  
  export const chooseOrAddDeliveryAddress = async (req, res) => {
    try {
      const { addressId, newAddress } = req.body;
      const userId = req.user.userId;
  
      const tourist = await Tourist.findById(userId);
      if (!tourist) {
        return res.status(404).json({ message: 'Tourist not found' });
      }
  
      let chosenAddress;
  
      if (addressId) {
        // Choose existing address
        chosenAddress = tourist.address.id(addressId);
        if (!chosenAddress) {
          return res.status(404).json({ message: 'Address not found' });
        }
      } else if (newAddress) {
        // Add new address
        tourist.address.push(newAddress);
        await tourist.save();
        chosenAddress = tourist.address[tourist.address.length - 1];
      } else {
        return res.status(400).json({ message: 'Either addressId or newAddress must be provided' });
      }
  
      // Update the most recent order with the chosen address
      const latestOrder = await Order.findOne({ user: userId }).sort({ createdAt: -1 });
      if (latestOrder) {
        latestOrder.deliveryAddress = chosenAddress;
        await latestOrder.save();
      }
  
      res.status(200).json({ 
        message: 'Delivery address updated successfully', 
        address: chosenAddress 
      });
    } catch (error) {
      console.error('Error in chooseOrAddDeliveryAddress:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };
  
  //4000056655665556