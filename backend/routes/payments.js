const express = require('express');
const stripeLib = require('stripe');
const { body } = require('express-validator');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const { protect } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validate');
const dotenv = require('dotenv');

dotenv.config();
const stripe = stripeLib(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.post(
  '/create-intent',
  protect,
  [body('bookingId').notEmpty(), body('paymentMethodType').notEmpty()],
  validateRequest,
  async (req, res, next) => {
    try {
      const { bookingId, paymentMethodType, couponCode } = req.body;
      const booking = await Booking.findById(bookingId).populate('shop');
      if (!booking) return res.status(404).json({ error: 'Booking not found.' });
      const amount = Math.round((booking.service.price + booking.extraCharge) * 100);
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'inr',
        payment_method_types: [paymentMethodType],
        metadata: { bookingId: booking._id.toString(), userId: req.user._id.toString() }
      });
      await Payment.create({
        booking: booking._id,
        user: req.user._id,
        amount: amount / 100,
        method: paymentMethodType,
        status: 'pending',
        transactionId: paymentIntent.id
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
      next(err);
    }
  }
);

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const payment = await Payment.findOne({ transactionId: paymentIntent.id });
    const booking = await Booking.findById(payment.booking);
    if (payment) {
      payment.status = 'success';
      payment.receiptUrl = paymentIntent.charges.data[0]?.receipt_url;
      await payment.save();
    }
    if (booking) {
      booking.paid = true;
      booking.status = 'confirmed';
      await booking.save();
    }
  }
  res.json({ received: true });
});

module.exports = router;
