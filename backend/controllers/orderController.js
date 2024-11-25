import Stripe from 'stripe';
import Order from '../models/orderModel.js';


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
      deliveryAddress,
      paymentMethod: 'cash',
      status: 'pending'
    });

    await newOrder.save();

    res.status(200).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    console.error('Error processing cash on delivery order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};//4000056655665556