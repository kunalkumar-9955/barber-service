const express = require('express');
const { body } = require('express-validator');
const Barber = require('../models/Barber');
const Booking = require('../models/Booking');
const { protect, authorizeRoles } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validate');

const router = express.Router();

router.post(
  '/register',
  protect,
  authorizeRoles('barber', 'admin'),
  [body('bio').optional().isString(), body('services').isArray({ min: 1 })],
  validateRequest,
  async (req, res, next) => {
    try {
      const barber = await Barber.create({
        user: req.user._id,
        ...req.body
      });
      res.status(201).json({ barber });
    } catch (err) {
      next(err);
    }
  }
);

router.get('/dashboard', protect, authorizeRoles('barber', 'admin'), async (req, res, next) => {
  try {
    const barberProfile = await Barber.findOne({ user: req.user._id });
    if (!barberProfile) {
      return res.status(404).json({ error: 'Barber profile not found.' });
    }
    const bookings = await Booking.find({ barber: barberProfile._id }).populate('shop user').sort({ scheduledAt: 1 });
    res.json({ bookings, total: bookings.length, barber: barberProfile });
  } catch (err) {
    next(err);
  }
});

router.put('/service/:id', protect, authorizeRoles('barber', 'admin'), async (req, res, next) => {
  try {
    const barber = await Barber.findById(req.params.id);
    if (!barber) return res.status(404).json({ error: 'Barber profile not found' });
    barber.services = req.body.services;
    await barber.save();
    res.json({ barber });
  } catch (err) {
    next(err);
  }
});

router.put('/status/:id', protect, authorizeRoles('barber', 'admin'), async (req, res, next) => {
  try {
    const barber = await Barber.findById(req.params.id);
    if (!barber) return res.status(404).json({ error: 'Barber profile not found' });
    barber.active = req.body.active;
    await barber.save();
    res.json({ barber });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
