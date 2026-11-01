const express = require('express');
const { body } = require('express-validator');
const Booking = require('../models/Booking');
const Shop = require('../models/Shop');
const Notification = require('../models/Notification');
const { protect, authorizeRoles } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validate');

const router = express.Router();

router.post(
  '/',
  protect,
  [
    body('shop').notEmpty(),
    body('service.name').notEmpty(),
    body('service.price').isNumeric(),
    body('scheduledAt').notEmpty()
  ],
  validateRequest,
  async (req, res, next) => {
    try {
      const shop = await Shop.findById(req.body.shop);
      if (!shop) return res.status(404).json({ error: 'Shop not found' });
      const extraCharge = req.body.bookingType === 'home' ? 150 : 0;
      const booking = await Booking.create({
        user: req.user._id,
        shop: shop._id,
        barber: req.body.barber,
        service: req.body.service,
        bookingType: req.body.bookingType || 'shop',
        address: req.body.address,
        extraCharge,
        scheduledAt: new Date(req.body.scheduledAt)
      });
      await Notification.create({
        user: req.user._id,
        title: 'Booking Created',
        message: `Your booking at ${shop.name} is pending confirmation.`
      });
      res.status(201).json({ booking });
    } catch (err) {
      next(err);
    }
  }
);

router.get('/', protect, async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('shop')
      .populate('barber')
      .sort({ scheduledAt: -1 });
    res.json({ bookings });
  } catch (err) {
    next(err);
  }
});

router.put('/cancel/:id', protect, async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    booking.status = 'cancelled';
    await booking.save();
    res.json({ booking });
  } catch (err) {
    next(err);
  }
});

router.put('/reschedule/:id', protect, async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    booking.scheduledAt = new Date(req.body.scheduledAt);
    booking.status = 'pending';
    await booking.save();
    res.json({ booking });
  } catch (err) {
    next(err);
  }
});

router.get('/pending', protect, authorizeRoles('barber', 'admin'), async (req, res, next) => {
  try {
    const bookings = await Booking.find({ status: 'pending' }).populate('user shop barber');
    res.json({ bookings });
  } catch (err) {
    next(err);
  }
});

router.put('/confirm/:id', protect, authorizeRoles('barber', 'admin'), async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    booking.status = 'confirmed';
    await booking.save();
    await Notification.create({ user: booking.user, title: 'Booking Confirmed', message: 'Your appointment has been confirmed.' });
    res.json({ booking });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
