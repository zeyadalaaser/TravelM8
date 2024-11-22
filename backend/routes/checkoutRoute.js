// import express from 'express';
// import Stripe from 'stripe';
// import { Order } from '../models/Order.js';
// import { verifyToken } from '../middleware/auth.js';

// const router = express.Router();
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// // Helper function to calculate total amount
// const calculateTotalAmount = (items) => {
//   return items.reduce((total, item) => total + item.price * item.quantity, 0);
// };

// // Pay with Stripe
// router.post('/pay-with-stripe', verifyToken, async (req, res) => {
//   try {
//     const { items, deliveryAddress, paymentMethodId, currency } = req.body;
//     const userId = req.user.id;

//     const totalAmount = calculateTotalAmount(items);

//     // Create a PaymentIntent with the order amount and currency
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(totalAmount * 100), // Stripe expects amount in cents
//       currency: currency.toLowerCase(),
//       payment_method: paymentMethodId,
//       confirm: true,
//       return_url: 'http://localhost:3000/order-confirmation', // Update with your frontend URL
//     });

//     if (paymentIntent.status === 'succeeded' || paymentIntent.status === 'requires_capture') {
//       // Create new order
//       const newOrder = new Order({
//         user: userId,
//         items,
//         totalAmount,
//         deliveryAddress,
//         paymentMethod: 'credit-card',
//         status: paymentIntent.status === 'succeeded' ? 'paid' : 'pending',
//         stripePaymentIntentId: paymentIntent.id
//       });

//       await newOrder.save();

//       res.status(200).json({ message: 'Payment successful', order: newOrder });
//     } else if (paymentIntent.status === 'requires_action') {
//       // 3D Secure authentication required
//       res.status(200).json({ 
//         requires_action: true, 
//         payment_intent_client_secret: paymentIntent.client_secret 
//       });
//     } else {
//       res.status(400).json({ message: 'Payment failed' });
//     }
//   } catch (error) {
//     console.error('Error processing Stripe payment:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // Pay with Cash on Delivery
// router.post('/pay-with-cash', verifyToken, async (req, res) => {
//   try {
//     const { items, deliveryAddress } = req.body;
//     const userId = req.user.id;

//     const totalAmount = calculateTotalAmount(items);

//     // Create new order
//     const newOrder = new Order({
//       user: userId,
//       items,
//       totalAmount,
//       deliveryAddress,
//       paymentMethod: 'cash',
//       status: 'pending'
//     });

//     await newOrder.save();

//     res.status(200).json({ message: 'Order placed successfully', order: newOrder });
//   } catch (error) {
//     console.error('Error processing cash on delivery order:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// export default router;